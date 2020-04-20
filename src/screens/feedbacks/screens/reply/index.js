import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import config from 'constants/config'
import moment from 'moment'
import { getFeedbackById } from '../../actions'
import { Loader, Spin } from 'components'
import * as _ from 'lodash'
import { Formik } from 'formik'
import {replyFeedback} from '../../actions'
import {
  CommonActions
} from 'services/global'

import './style.scss'
import bitcoinIcon from 'assets/images/crypto/btc.svg'
import paypalIcon from 'assets/images/crypto/paypal.svg'
import litecoinIcon from 'assets/images/crypto/ltc.svg'
import ethereumIcon from 'assets/images/crypto/eth.svg'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import stripeIcon from 'assets/images/crypto/stripe.svg'
import bitcoincashIcon from 'assets/images/crypto/bitcoincash.svg'
import skrillIcon from 'assets/images/crypto/skrill.svg'

const PAYMENT_ICONS = {
  paypal: paypalIcon,
  bitcoin: bitcoinIcon,
  litecoin: litecoinIcon,
  ethereum: ethereumIcon,
  perfectmoney: perfectmoneyIcon,
  stripe: stripeIcon,
  bitcoincash: bitcoincashIcon,
  skrill: skrillIcon
}

const user = window.localStorage.getItem('userId')

const PAYMENT_OPTS = {
  'paypal': 'PayPal',
  'bitcoin': 'BTC',
  'litecoin': 'LTC',
  'ethereum': 'ETH',
  'skrill': 'Skrill',
  'stripe': 'Stripe',
  'bitcoincash': 'BTH',
  'perfectmoney': 'Perfect Money'
}


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
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.actions.getFeedbackById(this.props.match.params.id).finally(() => {
      this.setState({loading: false})
    })
  }

  handleSubmit(values) {
    this.setState({ loading: true })
    this.props.replyFeedback({ ...values, uniqid: this.props.match.params.id }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.push({
        pathname: `/dashboard/${user}/feedback`
      })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.message)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    const currentFeedback = this.props.currentFeedback || 
      _.find(this.props.feedbacks, (feedback) => feedback.uniqid === this.props.match.params.id)
    const {loading} = this.state

  
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
                    <Button color="primary" className="mt-4 mb-3">Submit</Button>
                  </CardBody>
                  <CardBody className="p-4 invoice-view">
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
                              <h4 className="title">View Order {currentFeedback.invoice.developer_invoice == '1' &&
                                <b className={`small-badge badge-developer`} style={{  margin: '0 auto'}}>
                                  Developer
                                </b>
                              }</h4>
                            </div>
                            
                          </Col>
                          <Col lg={12}>
                            <Row className="flex">
                              <Col lg={6}>
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
                                    <Link to={`/dashboard/${user}/products/all/edit/${currentFeedback.invoice.product_id}`}>
                                      {currentFeedback.invoice.developer_invoice == '1'?currentFeedback.invoice.developer_title:(currentFeedback.product && currentFeedback.product.title || '')}
                                    </Link>
                                  </p>
                                </div>
                                <div className="d-flex">
                                  <p className="title">Value</p>
                                  <p>{`${config.CURRENCY_LIST[currentFeedback.invoice.currency]}${currentFeedback.invoice.total_display} ${currentFeedback.invoice.currency}`}</p>
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="d-flex">
                                  <p className="title">Quantity</p>
                                  <p>{currentFeedback.invoice.quantity}</p>
                                </div>

                                <div className="d-flex">
                                  <p className="title">Gateway</p>
                                  <p>{PAYMENT_OPTS[currentFeedback.invoice.gateway]}</p>
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
                          </Col>
                        </Row>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ReplyToFeedback)
