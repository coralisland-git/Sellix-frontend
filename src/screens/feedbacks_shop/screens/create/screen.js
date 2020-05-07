import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import { Button } from 'components';
import { Formik } from 'formik'
import { createFeedback } from './actions'
import { CommonActions } from 'services/global'
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
      initialValues: {
        message: "",
        score: 0,
      }
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
    this.props.commonActions.getFeedbackByUniqid(this.props.uniqid)
        .then(res => {

          if (res.status === 200) {

            let { feedback } = res.data

            if(feedback) {
              if(!feedback.score && feedback.feedback) {
                feedback.score = {
                  'negative': 1,
                  'neutral': 3,
                  'positive': 5
                }[feedback.feedback]
              }

              this.setState({
                initialValues: {
                  'message': feedback.message || "",
                  'score': +feedback.score
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

  handleSubmit = (values) => {
    this.setState({ loading: true })
    this.props.createFeedback({ ...values, uniqid: this.props.uniqid }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
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
        <Formik initialValues={this.state.initialValues} onSubmit={this.handleSubmit}>
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <Card className={"mb-0"}>
                <CardBody className="p-4">
                  <div className="flex-wrapper align-items-center">
                    <h3 className="text-primary">Leave your feedback</h3>
                    <p className="text-grey mt-3 mb-4">Was the product good? Write your feedback about it here.</p>
                  </div>
                  <div className="mb-4 mt-4 feedback-radioGroup justify-content-flex-start d-flex">
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
                    value={+props.values.score || 5} isHalf={false}/>
                  </div>
                  <Row>
                    <Col>
                      <FormGroup>
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
                  <Button color="primary" className="mt-3 mb-0" style={{ width: "200px"}}>Submit</Button>
                </CardBody>
              </Card>
            </Form>
          )}
        </Formik>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveFeedback)
