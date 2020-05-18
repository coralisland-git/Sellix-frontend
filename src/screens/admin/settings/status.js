import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col, FormGroup, Label, Input, Form, Row } from 'components/reactstrap'
import { Loader, Button } from 'components'
import { getStatus, updateStatus } from './actions'
import { CommonActions } from 'services/global'
import Select from "react-select";
import * as moment from 'moment/moment'
import random from 'random-letters';
import {Formik} from "formik";
import * as Yup from "yup";

import './style.scss';

const TYPE_LIST = [
  {value: "red", label: "Red"},
  {value: "blue", label: "Blue"},
  {value: "green", label: "Green"},
];

class Status extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      status: {}
    }
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.getStatus()
        .then(({ data: { status }}) => {

          if(status.messages) {
            this.setState({ status: {
                ...status.messages,
                type: TYPE_LIST.find(({ value }) => value === status.messages.type),
                status: status.status
            }})
          } else {
            this.setState({ status: {
                title: "",
                message: "",
                type: null,
                status: 1
              }})
          }
        })
        .finally(() => this.setState({ loading: false }))
  }

  formatOption = (option) => {
    switch (option.value) {
      case 'red':
        return <div style={{ color: "#ec2330", fontSize: "1rem", fontWeight: 700 }}>{option.label}</div>
      case 'blue':
        return <div style={{ color: "#01b6b2", fontSize: "1rem", fontWeight: 700 }}>{option.label}</div>
      case 'green':
        return <div style={{ color: "#5dbc61", fontSize: "1rem", fontWeight: 700 }}>{option.label}</div>
    }
  }

  handleSubmit = (values) => {
    this.setState({ loading: true });

    values.type = values.type.value
    values.created = moment().unix()
    values.id = random(7)
    this.props.updateStatus({ messages: JSON.stringify({
        messages: values
      }) })
        .then(() => {
          this.props.tostifyAlert('success', "Settings Update Succeeded")
          this.initializeData()
        })
        .catch(() => {
          this.props.tostifyAlert('error', 'Settings Update Failed')
        })
        .finally(() => {
          this.setState({ loading: false })
        });
  }

  hideMessage = () => {
    this.setState({ loading: true });

    this.props.updateStatus({ messages: "" })
        .then(() => {
          this.props.tostifyAlert('success', "Settings Update Succeeded")
          this.initializeData()
        })
        .catch(() => {
          this.props.tostifyAlert('error', 'Settings Update Failed')
        })
        .finally(() => {
          this.setState({ loading: false })
        });
  }


  render() {

    const { loading, status } = this.state;

    let validationSchema = Yup.object().shape({
          title: Yup.string().required('Title is required'),
          type: Yup.object().required('Type is required').nullable(),
          message: Yup.string().required('Message is required'),
    })

    return (
        <Formik initialValues={status} enableReinitialize={true} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
          {(form) => (
              <Form onSubmit={form.handleSubmit}>
                <FormGroup>
                  <h4 className="mb-4">Status</h4>
                </FormGroup>

                {loading && <div className={"loader-container"}><Loader /></div>}

                <Row>
                  <Col lg={12} >
                    <FormGroup className="mb-4">
                      <Label htmlFor={"title"}>Title</Label>
                      <Input
                          type="text"
                          id={"title"}
                          name={"title"}
                          placeholder={"Title"}
                          onChange={form.handleChange}
                          value={form.values.title}
                          className={form.errors.title && form.touched.title ? "is-invalid" : ""}
                      />
                        {form.errors.title && form.touched.title && (<div className="invalid-feedback">{form.errors.title}</div>)}
                    </FormGroup>
                    <FormGroup className="mb-4">
                      <Label htmlFor={"message"}>Message</Label>
                      <Input
                          type="textarea"
                          rows={6}
                          id={"message"}
                          name={"message"}
                          placeholder={"Message"}
                          onChange={form.handleChange}
                          value={form.values.message}
                          className={form.errors.message && form.touched.message ? "is-invalid" : ""}
                      />
                        {form.errors.message && form.touched.message && (<div className="invalid-feedback">{form.errors.message}</div>)}
                    </FormGroup>
                      <FormGroup className="mb-4">
                        <Label htmlFor={"message"}>Type</Label>
                        <Row>
                        <Col lg={8}>
                          <Select
                              id="event"
                              placeholder="Type of Status"
                              formatOptionLabel={this.formatOption}
                              options={TYPE_LIST}
                              classNamePrefix={"react-select"}
                              value={form.values.type}
                              onChange={(option) => form.handleChange("type")(option)}
                              className={form.errors.type && form.touched.type ? "is-invalid" : ""}
                              isSearchable={false}
                          />
                            {form.errors.type && form.touched.type && (<div className="invalid-feedback">{form.errors.type}</div>)}
                        </Col>
                        <Col lg={4}>
                          {!Boolean(+status.status) ? <Button style={{ width: "100%" }} color="primary" onClick={this.hideMessage}>Delete</Button> : null}
                        </Col>
                      </Row>
                      </FormGroup>
                    </Col>
                </Row>

                <Col lg={12} className={"mt-4 p-0 position-absolute"} style={{ bottom: "-6rem" }}>
                  <Button color="primary" type="submit" style={{width: 200}}>
                    Update Status
                  </Button>
                </Col>
              </Form>
          )}
        </Formik>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
  getStatus: bindActionCreators(getStatus, dispatch),
  updateStatus: bindActionCreators(updateStatus, dispatch),
})

export default connect(null, mapDispatchToProps)(Status)
