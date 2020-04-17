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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import StarRatings from 'react-star-ratings';
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import ReactTimeAgo from 'react-time-ago'
import { StarRating as ReactStarsRating } from 'components/star_ratings';

import {getFeedbacks} from './actions'
import './style.scss'

const user = window.localStorage.getItem('userId')


const mapStateToProps = (state) => {
  return ({
    feedbacks: state.feedbacks.feedbacks
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getFeedbacks }, dispatch),
  })
}

const MockFeedBack = [
  {id: "1",
  uniqid: "testing-uniqid",
  invoice_id: "testing-orderid",
  product_id: "testing-productid",
  user_id: "1",
  message: "feedback message",
  reply: "this is a reply",
  feedback: "neutral",
  date: "1583314021"}
]

const Stars = ({ value }) => (
  <>
    {Array(value).fill(null).map(() => <i class="bx bxs-star" style={{ color: '#f9e062' }}></i>)}
    {value !== 5 && Array(5 - value).fill(null).map(() => <i class="bx bxs-star" style={{ color: '#55566F' }}></i>)}
  </>
)

class Feedbacks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }

    // this.initializeData = this.initializeData.bind(this)
    this.replyToFeedback = this.replyToFeedback.bind(this)
    this.renderOption = this.renderOption.bind(this)
    this.caretRender = this.caretRender.bind(this)
  }

  componentDidMount () {
    this.props.actions.getFeedbacks()
  }

  

  renderThumb = (row) => {
    const item = this.props.feedbacks.filter(x => x.id == row)[0]
    return <Stars value={Number(item.score)} />
    // return <ReactStarsRating isEdit={false} value={item.score || 5} isHalf={false} className="transparent-bg react-stars-rating is-dashboard"/>
  }

  renderFeedback = (cell, row) => {
    const feedbackIcon = () => {
      switch ('positive') {
        case 'negative':
          return <i class="far fa-thumbs-down"></i>
        case 'neutral':
          return <i class="far fa-meh"></i>
        case 'positive':
          return <i class="far fa-thumbs-up"></i>
        default:
          return <p>{'positive'}</p>
      }
    }
    return (
      <div className="d-flex flex-row align-items-center justify-content-start feedback-main">
        <div title={`${'positive'[0].toUpperCase()}${'positive'.slice(1)}`} className={`feedback-container feedback-${'positive'}`}>
          {feedbackIcon()}
        </div>
      </div>
    )
  }

  replyToFeedback(e, id) {
    this.props.history.push({
      pathname: `/dashboard/${user}/feedback/reply/${id}`
    })
  }

  renderOption (cell, row) {
    return (
      <Button color="default" onClick={(e) => this.replyToFeedback(e, row.uniqid)}>Reply</Button>
    )
  }

  renderTime(cell, row) {

    const formatDate = (timestamp) => {
      return <ReactTimeAgo date={timestamp*1000/1} locale="en"/>
    }
    if (
      row.created_at
    ) {
      
      return (
        <div>
          <p>{formatDate(row.created_at)}</p>
          {row.updated_at && row.updated_at !== row.created_at && <p>
            (updated {formatDate(row.updated_at)})
          </p>}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  caretRender(direction) {
		return (
			<div style={{ marginLeft: 12.4, display: 'inline' }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						marginRight: 3,
						transform: `scale(${direction === 'desc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'asc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,15.272V4.586h.54V15.272l1.159-1.159.382.382L7.1,16.306,5.293,14.5l.382-.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						transform: `scale(${direction === 'asc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'desc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,5.619V16.306h.54V5.619L8.532,6.778,8.914,6.4,7.1,4.586,5.293,6.4l.382.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
			</div>
		)
	}

  render() {
    const { loading } = this.state
    return (
      <div className="product-screen mt-2">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Feedback</h1>
                </Col>
                <Col md={8}>
                  
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                :
                  <Row>
                    <Col lg={12}>
                      <div>
                        <BootstrapTable
                          options={ tableOptions() }
                          data={this.props.feedbacks}
                          version="4"
                          pagination
                          // totalSize={product_list ? product_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="title"
                            caretRender={this.caretRender}
                            dataSort
                            // dataAlign="center"
                            width="15%"
                            dataFormat={this.renderFeedback}
                          >
                            Feedback
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="message"
                            caretRender={this.caretRender}
                            dataSort
                            width = "30%"
                          >
                            Message
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            caretRender={this.caretRender}
                            dataSort
                            width="15%"
                            dataAlign="center"
                            dataFormat={this.renderThumb}
                          >
                            Rating
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            caretRender={this.caretRender}
                            dataSort
                            dataAlign="center"
                            dataFormat={this.renderOption}
                          >
                            Option
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="time"
                            caretRender={this.caretRender}
                            dataFormat={this.renderTime}
                            dataAlign="right"
                            dataSort
                          >
                            Time posted
                          </TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedbacks)
