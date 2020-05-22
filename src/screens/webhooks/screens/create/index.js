import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Input, Label, BreadcrumbItem, Breadcrumb } from 'components/reactstrap';
import Select from 'react-select';
import { Loader } from 'components'
import { Button } from 'components';
import { Formik } from 'formik';
import { CommonActions } from 'services/global';
import { createWebhook } from '../../actions';
import object from "yup/lib/object";
import string from "yup/lib/string";


const Yup = {
    object,
    string
}

const EVENT_OPTIONS = [
    { value: 'order:created', label: 'order:created' },
    { value: 'order:updated', label: 'order:updated' },
    { value: 'order:partial', label: 'order:partial' },
    { value: 'order:paid', label: 'order:paid' },
    { value: 'order:cancelled', label: 'order:cancelled' },
    { value: 'product:created', label: 'product:created' },
    { value: 'product:edited', label: 'product:edited' },
    { value: 'product:stock', label: 'product:stock' },
    { value: 'query:created', label: 'query:created' },
    { value: 'query:replied', label: 'query:replied' },
    { value: 'feedback:received', label: 'feedback:received' }
]


class CreateWebhookSimulator extends React.Component {
    
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initialValues: {
        url: '',
        event: '',
        key: ''
      },
    }
  }

  handleSubmit(values) {
    this.setState({loading: true})
    this.props.actions.createWebhook(values).then(res => {
      this.props.history.goBack()
      this.props.commonActions.tostifyAlert('success', res.message)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {

    const { loading, initialValues } = this.state;
    const validationSchema = Yup.object().shape({
          url: Yup.string().required('URL is required'),
          event: Yup.string().required('Event is required'),
          key: Yup.string(),
      })

    return (
      <div className="create-product-screen mt-3">
        <div className="animated fadeIn">

          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Webhooks</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
            {props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardHeader>
                    <Row style={{alignItems: 'center'}}>
                      <Col md={12}>
                        <h1>Webhook Simulator</h1>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="mb-4">
                    { 
                      loading ?
                        <Row>
                          <Col lg={12}>
                            <Loader />
                          </Col>
                        </Row>
                      :
                        <Row className="mt-2 mb-2">
                          <Col lg={12}>
                            <Row>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor="url">URL</Label>
                                  <Input 
                                    id="url"
                                    type="text" placeholder="URL"
                                    value={props.values.url}
                                    onChange={props.handleChange}
                                    className={
                                      props.errors.url && props.touched.url
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.url && props.touched.url && (
                                    <div className="invalid-feedback">{props.errors.url}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor="event">Events</Label>
                                  <Select 
                                    id="event"
                                    placeholder="Select events"
                                    classNamePrefix={"react-select"}
                                    options={EVENT_OPTIONS}
                                    isSearchable={false}
                                    value={props.values.event}
                                    onChange={(option) => {
                                      props.handleChange("event")(option.value);
                                    }}
                                    className={
                                      props.errors.event && props.touched.event
                                        ? "is-invalid"
                                        : ""
                                    }>
                                  </Select>
                                  {props.errors.event && props.touched.event && (
                                    <div className="invalid-feedback">{props.errors.event}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor="key">Key</Label>
                                  <Input 
                                    id="key"
                                    type="text" placeholder="Key"
                                    value={props.values.key}
                                    onChange={props.handleChange}
                                    className={
                                      props.errors.key && props.touched.key
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.key && props.touched.key && (
                                    <div className="invalid-feedback">{props.errors.key}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                    }
                  </CardBody>
                  { !loading && (
                    <Button color="primary" type="submit" className="" style={{width: 200}}>
                      Queue
                    </Button>
                  )}
                </Card>
              </Form>
              )}
            </Formik>
          </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    actions: bindActionCreators({ createWebhook }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateWebhookSimulator)
