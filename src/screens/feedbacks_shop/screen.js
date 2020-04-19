import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
} from 'reactstrap'
import StarRatings from 'react-star-ratings';
import { Loader } from 'components'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'
import {
  CommonActions
} from 'services/global'
import './style.scss'
import { StarRating as ReactStarsRating } from 'components/star_ratings';

const mapStateToProps = (state) => {
  return ({
    user_feedback: state.common.user_feedback
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class ShopFeedback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }

    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
    this.props.commonActions.getUserFeedbacks(this.props.match.params.username).then(res => {
      if (res.status === 200) {
        this.setState({ 
          loading: false,
          user_feedback: res.data.feedback
        })
      }
    })
  }

  render() {
    const { loading } = this.state
    const { user_feedback } = this.state

    return (
      <div className="feedback-shop-screen">
        <div className="animated customAnimation">
        {
            loading ?
              <Row>
                <Col lg={12}>
                  <Loader />
                </Col>
              </Row>
            :
              <Row className="py-3">
                {
                  user_feedback.map((feedback, key) =>
                    <Col lg={3} key={key}>
                      <Card className="">
                        <CardBody className="p-3 bg-white d-flex flex-column align-items-center justify-content-between">
                          <div className="text-left w-100">
                            <ReactStarsRating isEdit={false} value={Number(feedback.score)} isHalf={false} className="react-stars-rating"/>
                          </div>
                          <p style={{lineHeight: '15px', padding: '10px'}}>{feedback.message}</p>
                          {feedback.reply && <p style={{
                            borderLeft: '3px solid gray',
                            marginLeft: '10px',
                            padding: '10px'
                          }}>
                            {feedback.reply}  
                            <p className="reply-from-seller">— reply from the Seller</p>
                            <style>
                              {`
                              .reply-from-seller {
                                font-size: 11px;
                                color: gray !important;
                                margin: 8px 0;
                              }
                              `}
                            </style>
                          </p>}
                          <div className="d-flex flex-row justify-content-between w-100" style={{marginLeft: '15px'}}>
                            <p><i className="fas fa-check feedback-checked" /> Verified Purchase</p>
                            <p><ReactTimeAgo date={feedback.created_at*1000/1} locale="en"/></p>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>)
                }
                {user_feedback.length === 0 && <p className="w-100 text-center mt-4 mb-4">No Feedback Given</p>}
              </Row>
            }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopFeedback)
