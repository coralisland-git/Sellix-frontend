import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  Input,
  ButtonToolbar,
  ButtonGroup
} from 'reactstrap'
import { Formik } from 'formik'
import { createFeedback } from './actions'
import {
  CommonActions
} from 'services/global'
import { Loading } from 'components'
import { StarRating as ReactStarsRating } from 'components/star_ratings';

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    user: state.common.general_info,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    createFeedback: bindActionCreators(createFeedback, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
  })
}

class LeaveFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      loadingInitialValues: true,
      initialValues: {}
    }

    this.initializeData = this.initializeData.bind(this)
  }

  componentDidUpdate(prevProps) {
    let { user } = this.props;

    if(prevProps.user !== user) {
      document.title = `${user.username || ""} Feedback | Sellix`;
    }
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
    this.props.commonActions.getFeedbackByUniqid(this.props.match.params.id).then(res => {
      if (res.status === 200) {
        var existingFeedback = res.data.feedback

        if(existingFeedback) {
          if(!existingFeedback.score && existingFeedback.feedback) {
            existingFeedback.score = {
              'negative': 1,
              'neutral': 3,
              'positive': 5
            }[existingFeedback.feedback]
          }

          this.setState({ 
            initialValues: {
              'message': existingFeedback.message,
              'score': existingFeedback.score
            },
            loadingInitialValues: false
          })

        } else {
          window.location = "/404"
          this.setState({
            loadingInitialValues: false
          })
        }
      }
    })
  }

  handleSubmit(values) {
    this.setState({ loading: true })
    this.props.createFeedback({ ...values, uniqid: this.props.match.params.id }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      // this.props.history.push({
      //   pathname: '/admin/blacklist'
      // })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    if(this.state.loadingInitialValues) {
      return Loading()
    }
    return (
      <div className="animated fadeIn">
        <Formik
          initialValues={this.state.initialValues}
          onSubmit={(values) => {
            this.handleSubmit(values)
          }}>{props => (
            <Form onSubmit={props.handleSubmit}>
              <Row>
                <Col lg={8} className="ml-auto mr-auto">
                  <Card>
                    <CardBody className="p5-4 pb-5">
                      <div className="flex-wrapper align-items-center">
                        <h5 className="title text-primary f-18 mt-4">Leave your feedback</h5>
                        <p className="text-grey mt-3 mb-4">Was the product good? Write your feedback about it here.</p>
                      </div>
                      <div className="mb-4 feedback-radioGroup">
                      <ReactStarsRating className="transparent-bg cursor-pointer react-stars-rating" onChange={score => {
                        props.setFieldValue('score', score)
                        const feedback = {
                          1: 'negative',
                          2: 'negative',
                          3: 'neutral',
                          4: 'positive',
                          5: 'positive' 
                        }[score]
                        props.setFieldValue('feedback', feedback)
                      }} 
                                        value={props.values.score || 5} isHalf={false}/>
                      </div>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label htmlFor="warehouseName">Review</Label>
                            <Input
                              type="textarea"
                              className="pt-3 pb-3"
                              rows={5}
                              placeholder="Leave a text for your feedback"
                              name="message"
                              onChange={props.handleChange}
                              value={props.values.message}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button color="primary" className="mt-4 mb-3">Submit</Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveFeedback)
