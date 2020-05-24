import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col } from 'components/reactstrap'
import { Loader } from 'components'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { StarRating as ReactStarsRating } from 'components/star_ratings';
import { CommonActions } from 'services/global'
import './style.scss'



TimeAgo.addLocale(en)
const ReactTimeAgo = new TimeAgo('en-US')


class ShopFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }

    this.user = props.match.params.username;
  }

  componentDidUpdate(prevProps) {
    let { user } = this.props;
    if(prevProps.user !== user) {
      document.title = `Feedback | Sellix`;
    }
  }

  componentDidMount () {
    document.title = `Feedback | Sellix`;
    this.initializeData()
  }

  initializeData = async () => {
    try {
      let { status, data } = await this.props.getUserReviews(this.user)
      if (status === 200) {
        this.setState({
          user_feedback: data.feedback
        })
      }
    } catch (e) {

    } finally {
      this.setState({ loading: false })
    }
  }

  render() {

    const { loading, user_feedback } = this.state;

    return (
      <div className="feedback-shop-screen">
        <div className="animated customAnimation">
        {loading && <Row><Col lg={12}><Loader /></Col></Row>}
        {!loading &&
          <Row className="py-2">
                {
                  user_feedback.map(({ score, message, reply, created_at }) =>
                    <Col md={6} lg={4} key={created_at}>
                      <Card className="">
                        <CardBody className="px-3 py-3 bg-white d-flex flex-column align-items-center justify-content-between">
                          <div className={"d-flex w-100 align-items-center"}>
                            <div className="text-left w-100">
                              <ReactStarsRating isEdit={false} value={Number(score)} isHalf={false} className="react-stars-rating"/>
                            </div>
                            <span className={"w-100 text-right"}>{ReactTimeAgo.format(created_at*1000)}</span>
                          </div>
                          <span className={"message"}>{message}</span>
                          {reply && <span className={"reply"}><span>{reply}</span> <span className="reply-from-seller">— reply from the Seller</span></span>}

                          <div className="d-flex flex-row justify-content-between w-100">
                            <span><i className="fas fa-check feedback-checked" /> Verified Purchase</span>
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


const mapStateToProps = (state) => ({
  user_feedback: state.common.user_feedback,
  user: state.common.general_info,
})

const mapDispatchToProps = (dispatch) => ({
  getUserReviews: bindActionCreators(CommonActions.getUserReviews, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopFeedback)
