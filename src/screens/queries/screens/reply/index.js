import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import IntervalTimer from 'react-interval-timer'
import { Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Input, Breadcrumb, BreadcrumbItem } from 'components/reactstrap'
import {Button, Spin, Loader} from 'components';
import {Formik} from 'formik'
import {replyToQuery, getQueries, getQuery, closeQuery, reOpenQuery, getQueryViaWebsocket } from '../../actions'
import {CommonActions} from 'services/global'
import * as moment from 'moment/moment'

import './style.scss'


const user = window.localStorage.getItem('userId');


const RenderMessage = ({role, message, created_at}) => (
	<div className={role === 'customer' ? 'alignForCustomer' : 'alignForYou'}>
		<div className='queryMessageBlock'>
			<div className={"d-flex align-items-center w-100 mb-3"}>
				<div className='queryMessageTitle mr-2'>{role === 'customer' ? 'Customer' : 'You'}</div>
				<div className='queryMessageDate'>({moment(created_at * 1000).format("DD, MMM HH:mm")})</div>
			</div>
			<span><i>{message}</i></span>
		</div>
	</div>
)

class ReplyToQuery extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			messages: null,
			reply: false,
		}

		this.id = this.props.match.params.id;
	}

	componentDidMount() {
		this.getQuery()
	}

	getQuery = () => {
		this.props.getQuery(this.id)
			.then((res) => {
				this.setState({
					messages: res.data.messages
				})
			})
			.finally(() => {
				this.setState({
					loading: false
				})
			})
  }
  
  getQueryViaWebsocket = () => {
    this.props.getQueryViaWebsocket(this.id)
			.then((res) => {
				this.setState({
					messages: res
				})
			})
  }

	handleSubmit = (values, { resetForm }) => {

		this.setState({reply: true});

		let { tostifyAlert, replyToQuery } = this.props;

		replyToQuery({...values, uniqid: this.id})
			.then(res => {
				tostifyAlert('success', res.message);
				resetForm({ message: ""})
				this.getQuery()
			})
			.catch(err => tostifyAlert('error', err.error))
			.finally(() => this.setState({reply: false}))
	}


	closeQuery = () => {
		let {closeQuery, tostifyAlert, getQueries, history} = this.props;

		closeQuery({uniqid: this.id})
			.then((res) => {
				tostifyAlert('success', res.message)
				return getQueries()
			})
			.then((res) => {
				history.push({
					pathname: `/dashboard/${user}/queries`
				})
			})
			.catch((err) => tostifyAlert('error', err.error))
	}

	reOpenQuery = () => {
		let { reOpenQuery, tostifyAlert } = this.props;

		reOpenQuery({uniqid: this.id})
			.then((res) => {
				tostifyAlert('success', res.message)
				this.getQuery()
			})
			.catch((err) => tostifyAlert('error', err.error))
	}

	render() {

		let {loading, messages, reply} = this.state;
		let {history} = this.props;

		return (
			<div className="reply-screen mt-3">
				<div className="animated fadeIn">
					<Breadcrumb className="mb-0">
						<BreadcrumbItem active className="mb-0">
							<a onClick={(e) => history.goBack()}><i className="fas fa-chevron-left"/> Queries</a>
						</BreadcrumbItem>
					</Breadcrumb>

					{loading && <Loader/>}
					{!loading &&
					<Formik onSubmit={this.handleSubmit} initialValues={{ message: "" }}>
						{props =>
							<Form onSubmit={props.handleSubmit}>
								<Card>
									<CardHeader>
										<Row style={{alignItems: 'center'}}>
											<Col md={12}>
												<div className='queryTitle'>
													<h1>Ticket: {(messages[0] || {}).title}</h1>
													{(messages[0] || {}).status !== 'closed' ?
														<Button color="default" onClick={this.closeQuery}>Close</Button> :
														<Button color="default" style={{ background: "green"}} onClick={this.reOpenQuery}>Reopen</Button>
													}
												</div>
											</Col>
										</Row>
									</CardHeader>

									<CardBody className="p-4 pt-5">
										<Row>
											<Col lg={12}>
												<div className='queryChatBlock'>
													{messages.map(message => <RenderMessage {...message} key={message.id}/>)}
												</div>
												<FormGroup className={"mt-2"}>
													<Input
														type="textarea"
														className="pt-3 pb-3 "
														rows={7}
														name='message'
														placeholder="Reply to query"
														onChange={props.handleChange}
														value={props.values.message}
													/>
												</FormGroup>
											</Col>
										</Row>
										<Button color="primary" className="mt-4 mb-3">
											{reply ? <Spin/> : "Submit"}
										</Button>
									</CardBody>
								</Card>
							</Form>
						}
					</Formik>
					}
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
	replyToQuery: bindActionCreators(replyToQuery, dispatch),
	getQuery: bindActionCreators(getQuery, dispatch),
	getQueryViaWebsocket: bindActionCreators(getQueryViaWebsocket, dispatch),
	closeQuery: bindActionCreators(closeQuery, dispatch),
	getQueries: bindActionCreators(getQueries, dispatch),
	reOpenQuery: bindActionCreators(reOpenQuery, dispatch),
})


export default connect(null, mapDispatchToProps)(ReplyToQuery)
