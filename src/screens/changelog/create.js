import React, {useState} from 'react'
import { api } from 'utils'
import {Loader, Button, Spin, Loading} from 'components'
import {
	Card,
	CardBody,
	Row,
	Col,
	Label,
	Form,
	FormGroup,
	Input,
	CardHeader
} from 'reactstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Yup from "yup";
import { Formik } from 'formik'
import { createChangelog } from './actions'
import {CommonActions} from "../../services/global";
import * as moment from "moment/moment";

import "./styles.scss";



function ChangelogItem({ item }) {

	const [showMore, setShowMore] = useState(false)

	const hasShowMore = item.message.length > 75

	return <div className={"changelog-container"}>
		<h4>{item.title}</h4>
		<div className={"changelog"}>
			<p>{item.display_date}</p>
			<p style={{ padding: '0 3rem', width: "30rem" }}>{hasShowMore && !showMore ? item.message.substr(0, 75) + '...' : item.message}</p>
			<div className={'changelog-badge'}>{item.badge}</div>
		</div>
		{hasShowMore && <span onClick={() => setShowMore(!showMore)} className={'changelog-show-more'}>Show {showMore ? 'less' : 'more'}</span>}
	</div>
}


const mapDispatchToProps = (dispatch) => ({
	createChangelog: bindActionCreators(createChangelog, dispatch),
	tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
})

export class Changelog extends React.Component {

	state = {
		changelog: null
	}

	componentDidMount() {
		document.title = `Changelog | Sellix`;

		return api.get('/changelog')
			.then(res => {
				if (res.status === 200) {
					this.setState({
						changelog: res.data.changelog
					})
				} else {
					throw res
				}
			}).catch(err => {
				throw err
			})
	}

	handleSubmit = (values) => {
		this.setState({ loading: true })
		this.props.createChangelog({ ...values, display_date: moment().format("DD/MM/YYYY") })
		.then(res => {
			this.props.tostifyAlert('success', res.message)
			return api.get('/changelog');
		})
		.then(res => {
			if (res.status === 200) {
				this.setState({
					changelog: res.data.changelog
				})
			} else {
				throw res
			}
		})
		.catch(err => {
			this.props.tostifyAlert('error', err.error || err.message)
		}).finally(() => {
			this.setState({ loading: false })
		})
	}

	render() {
		const { loading, changelog } = this.state;
		const validationSchema = Yup.object().shape({
			message: Yup.string().required('Message is required'),
			title: Yup.string().required('Title is required'),
			badge: Yup.string().required('Badge is required'),
		});

		return <div className={'changelog-screen create'}>
			<div className="animated fadeIn">

					<Card className={"mb-0"}>
						<CardHeader>
							<Row style={{ alignItems: 'center' }}>
								<Col md={12}>
									<h1>Create changelog</h1>
								</Col>
							</Row>
						</CardHeader>
					</Card>

					{loading && <Row><Col lg={12}><Loader /></Col></Row>}
					{!loading &&
						<Row>
							<Col lg={4} md={12} className={"mb-5"}>
								<Formik
									noValidate="noValidate"
									initialValues={{message: '', badge: '', title: ''}}
									onSubmit={this.handleSubmit}
									validationSchema={validationSchema}
								>
									{props => (
										<Form onSubmit={props.handleSubmit}>
											<Card>
												<CardBody>
													<Row>
														<Col>
															<FormGroup>
																<Label htmlFor="title">Title</Label>
																<Input
																	name='title'
																	type="text"
																	id="title"
																	placeholder="Title"
																	onChange={props.handleChange}
																	value={props.values.title}
																	className={props.errors.title && props.touched.title ? "is-invalid" : ""}
																/>
																{props.errors.title && props.touched.title && <div className="invalid-feedback">{props.errors.title}</div>}
															</FormGroup>
														</Col>
													</Row>
													<Row>
														<Col>
															<FormGroup>
																<Label htmlFor="badge">Badge</Label>
																<Input
																	name='badge'
																	id="badge"
																	placeholder="Badge"
																	onChange={props.handleChange}
																	value={props.values.badge}
																	className={props.errors.badge && props.touched.badge ? "is-invalid" : ""}
																/>
																{props.errors.badge && props.touched.badge && <div className="invalid-feedback">{props.errors.badge}</div>}
															</FormGroup>
														</Col>
													</Row>
													<Row>
														<Col>
															<FormGroup>
																<Label htmlFor="message">Message</Label>
																<Input
																	name="message"
																	id="message"
																	rows={5}
																	type="textarea"
																	placeholder="Message"
																	onChange={props.handleChange}
																	value={props.values.message}
																	className={props.errors.message && props.touched.message ? "is-invalid pt-3 pb-3" : "pt-3 pb-3"}
																/>
																{props.errors.message && props.touched.message && <div className="invalid-feedback">{props.errors.message}</div>}
															</FormGroup>
														</Col>
													</Row>
												</CardBody>
											</Card>

											<Button color="primary" type="submit" className="mt-2" style={{width: 200}}>
												{loading ? <Spin/> : 'Create Changelog'}
											</Button>
										</Form>
									)}
								</Formik>
							</Col>
							<Col lg={8} md={12}>
								{changelog === null ? <Loading /> : changelog.map((item, key) => <ChangelogItem key={key} item={item} />)}
							</Col>
						</Row>
					}
			</div>

		</div>
	}
}

export default connect(null, mapDispatchToProps)(Changelog)