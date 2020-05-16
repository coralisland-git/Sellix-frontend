import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import { Button } from 'components';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import config from 'constants/config'
import * as moment from 'moment/moment'
import { getFeedbackById } from '../../actions'
import { Loader, Spin } from 'components'
import find from "lodash/find"
import { Formik } from 'formik'
import {replyFeedback} from '../../actions'
import { CommonActions } from 'services/global'

import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    currentFeedback: state.feedbacks.currentFeedback
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getFeedbackById }, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
    replyFeedback: bindActionCreators(replyFeedback, dispatch),
  })
}

class ReplyToFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      saving: false
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.actions.getFeedbackById(this.props.match.params.id).finally(() => {
      this.setState({loading: false})
    })
  }

  handleSubmit(values) {
    this.setState({ saving: true })
    this.props.replyFeedback({ ...values, uniqid: this.props.match.params.id }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.push({
        pathname: `/dashboard/${user}/feedback`
      })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.message)
    }).finally(() => {
      this.setState({ saving: false })
    })
  }

  render() {
    const currentFeedback = this.props.currentFeedback || 
      find(this.props.feedbacks, (feedback) => feedback.uniqid === this.props.match.params.id)
    const {loading, saving} = this.state

  
    if (!currentFeedback) { return null }
    return (
      <div className="reply-screen mt-3">
        <div className="animated fadeIn">
          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left" /> Feedback</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <Formik
            initialValues={{reply: currentFeedback.reply}}
            enableReinitialize={true}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}>{props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardHeader>
                    <Row style={{ alignItems: 'center' }}>
                      <Col md={12}>
                        <h1>Reply to feedback</h1>
                      </Col>
                    </Row>
                  </CardHeader>
                  <Row>
                    <Col lg={5}>
                      <CardBody className="p-4 invoice-view mb-4">
                      {
                        loading ?
                          <Row>
                            <Col lg={12}>
                              <Loader />
                            </Col>
                          </Row>
                        : 
                          <Row className="">
                            <Col lg={12}>
                              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                                <label className="fw-600 mt-2">View Order {currentFeedback.invoice.developer_invoice == '1' &&
                                  <b className={`small-badge badge-developer`} style={{  margin: '0 auto'}}>
                                    Developer
                                  </b>
                                }</label>
                              </div>
                              
                            </Col>
                            <Col lg={12}>
                              <div className="d-flex">
                                <p className="title">Invoice ID</p>
                                <p>
                                  <Link to={`/dashboard/${user}/orders/view/${currentFeedback.invoice.uniqid}`}>
                                    {currentFeedback.invoice.uniqid}
                                  </Link>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="title">Customer</p>
                                <p><a href={`mailto:${currentFeedback.invoice.customer_email}`}>{currentFeedback.invoice.customer_email}</a></p>
                              </div>
                              <div className="d-flex">
                                <p className="title">Product</p>
                                <p>
                                  <Link to={`/dashboard/${user}/products/edit/${currentFeedback.invoice.product_id}`}>
                                    {currentFeedback.invoice.developer_invoice == '1'?currentFeedback.invoice.developer_title:(currentFeedback.product && currentFeedback.product.title || '')}
                                  </Link>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="title">Value</p>
                                <p>{`${config.CURRENCY_LIST[currentFeedback.invoice.currency]}${currentFeedback.invoice.total_display} ${currentFeedback.invoice.currency}`}</p>
                              </div>
                              <div className="d-flex">
                                <p className="title">Quantity</p>
                                <p>{currentFeedback.invoice.quantity}</p>
                              </div>

                              <div className="d-flex">
                                <p className="title">Gateway</p>
                                <p>{config.PAYMENT_OPTS[currentFeedback.invoice.gateway]}</p>
                              </div>
                              
                              <div className="d-flex">
                                <p className="title">Country</p>
                                <p><i className={`flag-icon flag-icon-${currentFeedback.invoice.country && currentFeedback.invoice.country.toLowerCase()} mr-2`}/> 
                                  {currentFeedback.invoice.location}</p>
                              </div>
                              <div className="d-flex">
                                <p className="title">Created At</p>
                                <p>{moment(new Date(currentFeedback.invoice.created_at*1000)).format('DD, MMM YYYY HH:mm')}</p>
                              </div>
                            </Col>
                          </Row>
                      }
                    </CardBody>
                    </Col>
                    <Col lg={7}>
                      <CardBody className="p5-4 pb-4 mb-4">
                        <Row>
                          <Col lg={8}>
                            <FormGroup>
                              <Label htmlFor="warehouseName">Feedback <span className={`badge badge-${currentFeedback.feedback.toLowerCase()}`}>{currentFeedback.feedback.toLowerCase()}</span></Label>
                              <div>
                                <p className="text-grey mt-3 mb-4">{currentFeedback.message}</p>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <FormGroup>
                              <Label htmlFor="warehouseName">Reply</Label>
                              <Input
                                type="textarea"
                                className="pt-3 pb-3 "
                                rows={7}
                                placeholder="Reply to feedback"
                                onChange={e => props.setFieldValue('reply', e.target.value)}
                                value={props.values.reply}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button color="primary" className="mt-4 mb-3" disabled={saving}>{saving?<Spin/>:'Submit'}</Button>
                      </CardBody>
                    </Col>
                  </Row>
                  
                  
                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyToFeedback)
