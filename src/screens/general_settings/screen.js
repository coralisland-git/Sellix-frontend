import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Form,
  Input
} from 'reactstrap'
import {Button, Spin} from 'components';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Loader } from 'components'
import { saveGeneralSettings } from './actions'
import { CommonActions, AuthActions } from 'services/global'
import './style.scss'


const mapDispatchToProps = (dispatch) => ({
  saveGeneralSettings: bindActionCreators(saveGeneralSettings, dispatch),
  getUserSettings: bindActionCreators(AuthActions.getUserSettings, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch)
})

class GeneralSettings extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initialValues: {
        profile_attachment: '',
        email: '',
        username: ''
      }
    }
  }

  handleSubmit(data) {
    this.setState({ loading: true });
    let { saveGeneralSettings, tostifyAlert } = this.props;

    saveGeneralSettings(data).then(res => {
      tostifyAlert('success', res.message)
    }).catch(err => {
      tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }


  componentDidMount() {
    this.setState({ loading: true });

    this.props.getUserSettings()
      .then(({ data }) => {
        const { profile_attachment='', email='', username='' } = data.settings;

        this.setState({
          initialValues: { profile_attachment, email, username, }
        })
      })
      .finally(() => {
        this.setState({loading: false})
      })
  }

  render() {
    const { 
      loading,
      initialValues
    } = this.state;

    let validationSchema = Yup.object().shape({
      profile_attachment: Yup.string(),
      email: Yup.string().email('Please enter the valid email').required('Email is required'),
      username: Yup.string().required("Username is required")
    })

    return (
      <div className="create-product-screen">
        <div className="animated fadeIn">
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={this.handleSubmit}
            validationSchema={validationSchema}
          >
              {({ handleSubmit, handleChange, values, errors, touched}) => (
                <Form onSubmit={handleSubmit}>
                  <Card>
                    <CardBody className="p-4 mb-4 position-relative">
                      {loading && <div className={"loader-container"}><Loader/></div>}

                      <Row className="">
                        <Col lg={12}>
                          <Row>
                            <Col lg={12}>
                              <FormGroup>
                                <h4 className="mb-4">General Information</h4>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <FormGroup className="mb-4">
                                <Label htmlFor="profile_attachment">Avatar URL</Label>
                                <Input
                                  type="text"
                                  id="profile_attachment"
                                  name="profile_attachment"
                                  placeholder="Avatar URL"
                                  onChange={handleChange}
                                  value={values.profile_attachment}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
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
                            </Col>
                            <Col lg={12}>
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
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>

                    <Button color="primary" type="submit" className="" style={{width: 200}}>
                      {loading ? <Spin/> : 'Save Settings'}
                    </Button>
                    
                  </Card>
                </Form>
              )}
            </Formik>
                  
          
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(GeneralSettings)
