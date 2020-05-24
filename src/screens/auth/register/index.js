import React from 'react'
import Link from 'react-router-dom/es/Link'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'components';
import {
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  Row,
  FormGroup,
  Label
} from 'components/reactstrap'
import { Formik } from 'formik';

import ReCAPTCHA from "react-google-recaptcha";
import config from 'constants/config'

import { AuthActions, CommonActions} from 'services/global'

import './style.scss'
import object from "yup/lib/object";
import string from "yup/lib/string";


const Yup = {
  object,
  string,
  ref: () => {},
}
const mapDispatchToProps = dispatch => ({
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch)
})

class Register extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      initialValues: {
        email: '',
        username: '',
        password: '',
        confirm_password: ''
      },
      captchaVerify: null
    }

    this.captcha = {}
  }

  handleSubmit = (data) => {

    let { tostifyAlert } = this.props;
    let { register } = this.props.authActions;
    let { captchaVerify } = this.state;

    if(!captchaVerify) {
      tostifyAlert('error', 'reCAPTCHA verification failed, please try again.')
      return;
    }

    data.captcha = captchaVerify

    let obj = Object.assign({}, data)
    delete obj['confirm_password'];

    register(obj)
        .then(res => {
          if(res.status === 202) {
            this.props.history.push({
              pathname: '/auth/login',
              state: {
                success: true,
                message: res.message
              }
            })
          } else {
            tostifyAlert('error', res.error)
            this.captcha.reset();
          }

    }).catch(err => {
      tostifyAlert('error', err.error)
      this.captcha.reset();
    })
  }

  render() {

    let { initialValues, password } = this.state;

    let validationSchema = Yup.object().shape({
      email: Yup.string()
          .email('Please enter the valid email')
          .required('Email is required'),
      username: Yup.string()
          .min(3, 'Username must be at least 3 characters long')
          .required('Username is required'),
      password: Yup.string()
          .min(8, 'Password must be at least 8 characters long')
          .required("Password is required"),
      confirm_password: Yup.string()
          .required("Confirm your password")
          .when("password", {
            is: val => val && val.length > 0,
            then: Yup.string().oneOf(
                [password],
                "Both password need to be the same"
            )})
    });

    return (
      <div className="register-screen">
        <div className="animated fadeIn">
          <div className="app flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="11">
                  <CardGroup>
                    <Card className="second-card text-white bg-primary d-md-down-none">
                      <CardBody className="text-center bg-primary flex align-items-center">
                          <h2 className="mb-3"><b>Welcome back!</b></h2>
                          <p style={{width: '90%'}}>To keep connected with us please login with your personal info.</p>
                          <Link to="/auth/login">
                            <Button color="primary" active>Sign In</Button>
                          </Link>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody className="p-5 bg-gray-100">
                        <Formik
                          initialValues={initialValues}
                          onSubmit={this.handleSubmit}
                          validationSchema={validationSchema}
                        >
                          {({ handleSubmit, handleChange, values, errors, touched }) => (
                              <Form onSubmit={handleSubmit}>

                                <h4 className="text-center mb-4">Create Account </h4>

                                <FormGroup className="mb-3">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    value={values.email}
                                    className={errors.email && touched.email ? "is-invalid" : ""}
                                  />
                                  {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                                </FormGroup>

                                <FormGroup className="mb-3">
                                  <Label htmlFor="username">Username</Label>
                                  <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    value={values.username}
                                    className={errors.username && touched.username ? "is-invalid" : ""}
                                  />
                                  {errors.username && touched.username && <div className="invalid-feedback">{errors.username}</div>}
                                </FormGroup>

                                <FormGroup className="mb-4">
                                  <Label htmlFor="password">Password</Label>
                                  <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                      handleChange(e);
                                      this.setState({
                                        password: e.target.value
                                      })
                                    }}
                                    value={values.password}
                                    className={errors.password && touched.password ? "is-invalid" : ""}
                                  />
                                  {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                                </FormGroup>

                                <FormGroup className="mb-4">
                                  <Label htmlFor="confirm_password">Password Confirmation</Label>
                                  <Input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="Password Confirmation"
                                    onChange={handleChange}
                                    value={values.confirm_password}
                                    className={errors.confirm_password && touched.confirm_password ? "is-invalid" : ""}
                                  />
                                  {errors.confirm_password && touched.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                                </FormGroup>

                                <div className="ml-auto mr-auto recptcah" style={{width: 'fit-content'}}>
                                  <ReCAPTCHA
                                    ref={el => { this.captcha = el }}
                                      sitekey={config.CAPTCHA_SITE_KEY}
                                      theme="light"
                                      size="normal"
                                      onChange={(captcha) => {this.setState({captchaVerify: captcha})}}
                                      onExpired={() => {this.setState({captchaVerify: null})}}
                                      onErrored={() => {this.setState({captchaVerify: null})}}
                                  />
                                </div>

                                <Row>
                                  <Col lg={12} className="text-center mt-4">
                                    <Button color="primary" type="submit">Sign Up</Button>
                                  </Col>
                                </Row>
                                
                              </Form>
                            )}
                          </Formik>
                      </CardBody>
                    </Card>
                    
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Register)
