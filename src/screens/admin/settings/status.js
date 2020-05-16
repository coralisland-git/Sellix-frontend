import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Col, FormGroup, Label, Input, Form, Row} from 'reactstrap'
import { Loader, Button } from 'components'
import { getStatus, updateStatus } from './actions'
import { CommonActions } from 'services/global'
import Select from "react-select";
import * as moment from 'moment/moment'

import './style.scss';
import {Formik} from "formik";


class Status extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      settings: {}
    }
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.getStatus()
        .then((response) => {
          if(response.status === 401) {
            this.setState({ showPlaceholder: true })
          } else {
            this.setState({ settings: response })
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


  render() {

    const { loading, showPlaceholder, isOpen, settings } = this.state;

    return (
        <Formik initialValues={{}} enableReinitialize={true} onSubmit={this.handleSubmit}>
          {(form) => (
              <Form onSubmit={form.handleSubmit}>
                <FormGroup>
                  <h4 className="mb-4">Status</h4>
                </FormGroup>

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
                      />
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
                      />
                    </FormGroup>
                      <FormGroup className="mb-4">
                        <Label htmlFor={"message"}>Type</Label>
                        <Row>
                        <Col lg={8}>
                          <Select
                              id="event"
                              placeholder="Type of Status"
                              formatOptionLabel={this.formatOption}
                              options={[
                                {value: "red", label: "Red"},
                                {value: "blue", label: "Blue"},
                                {value: "green", label: "Green"},
                              ]}
                              classNamePrefix={"react-select"}
                              isSearchable={false}
                              value={form.values.type}
                              onChange={(option) => form.handleChange("type")(option)}/>
                        </Col>
                        <Col lg={4}>
                          <Button color={"primary"} style={{ width: "100%" }}>Delete</Button>
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
