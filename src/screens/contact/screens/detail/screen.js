import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import { Button } from 'components';
import * as Yup from "yup";
import map from "lodash/map"
import find from "lodash/find"
import { Formik } from 'formik'
import { replyQuerie } from './actions'
import { Spin } from 'components'
import { getQuerie } from './actions'
import { closeQuerie } from './actions'
import { reopenQuerie } from './actions'
import { CommonActions } from 'services/global'

import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    querie: state.queries.querie,
    user: state.common.general_info,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    replyQuerie: bindActionCreators(replyQuerie, dispatch),
    actions: bindActionCreators({ getQuerie }, dispatch),
    closeQuerie: bindActionCreators({ closeQuerie }, dispatch),
    reopenQuerie: bindActionCreators({ reopenQuerie }, dispatch),
  })
}

class ReplyToQuerie extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidUpdate(prevProps) {
    let { user } = this.props;
    if(user || prevProps.user !== user) {
      document.title = `Contacts | Sellix`;
    }
  }

  componentDidMount() {
    document.title = `Contacts | Sellix`;
    this.props.actions.getQuerie(this.props.match.params.id)
  }

  handleSubmit(values) {
    this.setState({ loading: true })
    this.props.replyQuerie({ ...values, uniqid: this.props.match.params.id }).then(res => {
      this.props.actions.getQuerie(this.props.match.params.id)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  renderMessages = () => {
    return map(this.props.querie, querie => {
      return <div className={querie.role === 'customer' ? 'alignForCustomerCS' : 'AlignForYouCS'}>
        <div className='querieMessageBlockCS'>
          <div className='querieMessageTitle'>{querie.role === 'customer' ? 'You' : 'Seller'}</div>
          <div>{querie.message}</div>
          <div className='querieMessageDate'>{querie.day_value}-{querie.month}-{querie.year}</div>
        </div>
      </div>
    })
  }

  closeQuerie = (uniqid) => {
    this.props.closeQuerie.closeQuerie({ uniqid }).then((res) => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.actions.getQuerie(this.props.match.params.id)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    })
  }

  render() {
    const { loading } = this.state
    const currentQuerie = find(this.props.querie, (querie) => querie.uniqid === this.props.match.params.id)
    if (!currentQuerie) { return null }
    return (
      <div className="query-view-screen mt-3">
        <div className="animated fadeIn">
          <Formik
            noValidate="noValidate"
						initialValues={{message: ''}}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}
            validationSchema={Yup.object().shape({
							message: Yup.string().required('Message is required'),
						})}>{props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardHeader>
                    <Row style={{ alignItems: 'center' }}>
                      <Col md={12}>
                        <div className='querieTitle'>
                          <h1>TICKET - {this.props.querie[0].uniqid} 
                            { this.props.querie[0].status == 'closed' && 
                              <span className={`query-badge badge-closed ml-2`}>
                                closed
                              </span>
                            }
                            </h1>
                          {this.props.querie[0].status != 'closed' && <Button color="default" onClick={(e) => this.closeQuerie(this.props.match.params.id)}>Close</Button>}
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="p5-4 pb-5">
                    <Row>
                      <Col lg={12}>
                        <div className='QuerieChatBlock'>
                          {this.renderMessages()}
                        </div>
                        {
                          this.props.querie[0].status != 'closed' && 
                          <FormGroup>
                            <Input
                              type="textarea"
                              className="pt-3 pb-3 "
                              rows={7}
                              name='message'
                              placeholder="Reply to Seller"
                              onChange={props.handleChange}
                              value={props.values.message}
                              className={
                                props.errors.message && props.touched.message
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            {props.errors.message && props.touched.message && (
                              <div className="invalid-feedback">{props.errors.message}</div>
                            )}
                          </FormGroup>
                        }
                      </Col>
                    </Row>
                    {
                      this.props.querie[0].status != 'closed' && 
                      <Button color="primary" className="mt-4 mb-3" disabled={loading}>{loading?<Spin/>:'Submit'}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReplyToQuerie)
