import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col, Label, Form, FormGroup, Input } from 'components/reactstrap'
import { Button } from 'components';
import { Formik } from 'formik'
import { CommonActions } from 'services/global'
import { createQuery} from './actions'
import * as Yup from "yup";

import discordIcon from 'assets/images/discord.png'

import './style.scss'


class Contact extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }

    this.username = this.props.match.params.username;
    document.title = `Contact | Sellix`;
  }

  componentDidMount() {
    document.title = `Contact | Sellix`;
  }

  handleSubmit = (values) => {
    this.setState({ loading: true })
    this.props.createQuery({...values, username: this.username})
        .then(res => {
            this.props.tostifyAlert('success', res.message)
            this.props.history.push({
              pathname: `/${this.username}/query/${res.data.uniqid}`
            })
          }).catch(err => {
            this.props.tostifyAlert('error', err.error)
          }).finally(() => {
            this.setState({ loading: false })
          })
  }

  render() {

    const { user } = this.props;


      let validationSchema = Yup.object().shape({
          email: Yup.string().required('Email is required'),
          title: Yup.string().required('Title is required'),
          message: Yup.string().required('Message is required')
      });

      let initialValues = { title: "", email: "", message: "" }


      return (
      <div className="contact-screen container">
        <div className="animated customAnimation">
          <Formik onSubmit={this.handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
            {props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardBody className="mt-4 pb-3 pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="title text-primary f-18">Create a Query</h4>
                      <div style={{ height: 65 }}>
                        {
                          user.shop_discord_link && 
                            <a href={user.shop_discord_link} target="_blank">
                              <img src={discordIcon} width="200" height="65" alt={"Discord"}/>
                            </a>
                        }
                      </div>
                    </div>

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            name='title' 
                            id='title'
                            type="text"
                            placeholder="Title" 
                            onChange={props.handleChange}
                            value={props.values.title}
                            className={
                              props.errors.title && props.touched.title
                                  ? "is-invalid"
                                  : ""
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            name='email'
                            type="email" 
                            placeholder="Email"
                            onChange={props.handleChange}
                            value={props.values.email}
                            className={
                              props.errors.email && props.touched.email
                                  ? "is-invalid"
                                  : ""
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="pt-3 pb-3">
                          <Label htmlFor="message">Message</Label>
                          <Input 
                            type="textarea"
                            name='message'
                            rows={5} 
                            placeholder="What would you like to ask?" 
                            onChange={props.handleChange}
                            value={props.values.message}
                            className={props.errors.message && props.touched.message ? "is-invalid" : ""}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="primary" className="mt-4 mb-3">Ask</Button>
                  </CardBody>
                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  user: state.common.general_info,
})
const mapDispatchToProps = (dispatch) => ({
  createQuery: bindActionCreators(createQuery, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
