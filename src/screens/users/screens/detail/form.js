import React, { Component } from 'react'
import {
  Card,
  CardBody,
  Row,
  Col, Form, FormGroup, Label, Input
} from 'reactstrap'
import { Loader, Button, Spin } from 'components'
import { Formik } from "formik";
import { withRouter } from "react-router-dom";

import './style.scss'



class UserEditForm extends Component {

  render() {
    const { user, loading, handleSubmit } = this.props;
    const { id } = user;


    return (
        <Card>
          <CardBody className="p-4 mb-4 position-relative">
            <Formik initialValues={user} enableReinitialize={true} onSubmit={handleSubmit}>
              {({ handleSubmit, handleChange, values }) => (
                  <Form onSubmit={handleSubmit} >
                      <Row>
                          <Col lg={12}>
                            <Row>
                              <Col lg={12}>
                                <FormGroup>
                                  <h4 className="mb-4">Edit User</h4>
                                </FormGroup>
                              </Col>
                            </Row>

                            {loading && <div className={"loader-container"}><Loader /></div>}

                            <Row>
                              <Col lg={12}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="username">Username</Label>
                                  <div className="d-flex">
                                    <Input name={"username"} onChange={handleChange} value={values.username}/>
                                  </div>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="email">Email</Label>
                                  <div className="d-flex">
                                    <Input name={"email"} onChange={handleChange} value={values.email}/>
                                  </div>
                                </FormGroup>

                                <FormGroup check  className="mb-3 pl-0">
                                  <div className="custom-checkbox custom-control">
                                    <Input
                                        className="custom-control-input"
                                        type="checkbox"
                                        id="otp_2fa"
                                        name="otp_2fa"
                                        onChange={(e) => handleChange('otp_2fa')(e.target.checked)}
                                        checked={Boolean(Number(values.otp_2fa))}
                                    />
                                    <Label className="custom-control-label"  htmlFor="otp_2fa" check>
                                      OTP 2FA
                                    </Label>

                                  </div>
                                </FormGroup>

                                <FormGroup check  className="mb-3 pl-0">
                                  <div className="custom-checkbox custom-control">
                                    <Input
                                        className="custom-control-input"
                                        type="checkbox"
                                        id="email_2fa"
                                        name="email_2fa"
                                        onChange={(e) => handleChange('email_2fa')(e.target.checked)}
                                        checked={Boolean(Number(values.email_2fa))}
                                    />
                                    <Label htmlFor="email_2fa" check className="custom-control-label">
                                      Email 2FA
                                    </Label>
                                  </div>
                                </FormGroup>

                              </Col>
                            </Row>

                          </Col>

                          <Col lg={12} style={{ textAlign: "right"}}>
                            <Button color="primary" type="submit" className="" style={{width: 200}}>
                              {loading ? <Spin/> : 'Save Settings'}
                            </Button>
                          </Col>
                        </Row>
                  </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
    )
  }
}

export default withRouter(UserEditForm)
