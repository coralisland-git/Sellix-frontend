import React from 'react'
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap'

import {Formik} from "formik";
import * as Yup from "yup";
import {Loader} from "../../components";
import Select from "react-select";
import {connect} from 'react-redux'
import {api} from "../../utils";
import { withRouter } from "react-router-dom";
import './style.scss'
import {bindActionCreators} from "redux";
import {AuthActions, CommonActions} from "../../services/global";


const OPTIONS = [
    {value: 'website_bug', label: 'Website Bug'},
    {value: 'feedback', label: 'Feedback'},
    {value: 'order', label: 'Order'},
    {value: 'payment_issues', label: 'Payment Issue'},
    {value: 'other', label: 'Other'},
]

const ZENDESK_KEY = "fDcM3Ib5ADtloi5i2xHLMsuNvSHnXIOr3z6crmHo";
const ZENDESK_URL = "https://sellix.zendesk.com/api/v2/tickets.json";
const ZENDESK_EMAIL = "fmarzahl137@gmail.com";

class Tickets extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            client: null
        }
    }

    componentDidMount() {
        document.title = `Create Ticket | Sellix`;
        let isLoggedin = window.localStorage.getItem('userId')

        if(isLoggedin) {
            this.props.authActions.getSelfUser()
        } else {
            this.props.history.push('/')
        }

        if(window.ZAFClient) {
            let client = window.ZAFClient.init();
            this.setState({
                client
            })
        }
    }

    handleSubmit = async ({ subject, message, category }) => {

        const { email, username } = this.props.user;
        const requester = { name: username, email: email };
        const comment = { body: message };
        const custom_fields = [{ id: 360006801217, value: category }]
        const ticket = {
            requester,
            subject,
            comment,
            custom_fields
        };

        if(this.state.client) {

            var settings = {
                url: ZENDESK_URL,
                headers: {'Authorization': `Basic ${btoa(`${ZENDESK_EMAIL}/token:${ZENDESK_KEY}`)}`},
                secure: true,
                cors: true,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ ticket })
            };

            this.state.client.request(settings).then((res) => {
                console.log(res)
                this.props.commonActions.tostifyAlert('success', "Your ticket has been created. Additional information have been sent to your email.")
            });
        } else {
            try {
                const response = await api.post(ZENDESK_URL, JSON.stringify({ ticket }), {
                    // credentials: true,
                    // withCredentials: true,
                    // withCors: true,
                    // enablePreflight: false,
                    // crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Authorization': `Basic ${btoa(`${ZENDESK_EMAIL}/token:${ZENDESK_KEY}`)}`
                    }
                });

                if (!response.request) {
                    console.log(response)
                    this.props.commonActions.tostifyAlert('error', response || 'Seomthing went wrong!')
                } else {
                    console.log(response)
                    this.props.commonActions.tostifyAlert('success', "Your ticket has been created. Additional information have been sent to your email.")
                }

            } catch (error) {
                console.log(error)
                this.props.commonActions.tostifyAlert('error', error || 'Seomthing went wrong!')
                return error;
            }
        }
    }



    render() {

        let loading = false;
        let validationSchema = Yup.object().shape({
            category: Yup.string().required('Category is required'),
            subject: Yup.string().required('Subject is required'),
            message: Yup.string().required('The message fields is required')
        });

        return (
            <div className="ticket-screen light">
                <div className="animated fadeIn">

                    <div className="section text-center ">
                        <Container className="home-container" fluid>
                            <h1>Create a Tickets</h1>
                            <p className={'large'}>Describe your problem in detail</p>
                        </Container>
                    </div>

                    <div className="section bg-white" style={{ padding: "3rem 0 "}}>
                        <Container className="home-container">
                            <Formik onSubmit={this.handleSubmit} validationSchema={validationSchema}>
                                {({handleSubmit, values, errors, handleChange, touched}) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Card>
                                            <CardBody className="p-4 mb-2 ">
                                                {loading && <Row><Col lg={12}><Loader/></Col></Row>}
                                                {!loading &&
                                                <Row className="mb-2">
                                                    <Col lg={12}>
                                                        <Row className={'justify-content-center'}>
                                                            <Col lg={8}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="category">Category</Label>
                                                                    <Select
                                                                        options={OPTIONS}
                                                                        id="category"
                                                                        value={values.category}
                                                                        searchable={false}
                                                                        onChange={({value}) => handleChange("category")(value)}
                                                                        className={errors.category && touched.category && "is-invalid"}
                                                                        name="category"
                                                                    />
                                                                    {errors.category && touched.category && <div
                                                                        className="invalid-feedback">{errors.category}</div>}
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={8}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="subject">Subject</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="subject"
                                                                        name="subject"
                                                                        placeholder="Question regarding dashboard"
                                                                        onChange={handleChange}
                                                                        value={values.subject || ""}
                                                                        className={errors.subject && touched.subject && "is-invalid"}
                                                                    />
                                                                    {errors.subject && touched.subject && <div
                                                                        className="invalid-feedback">{errors.subject}</div>}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg={8}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="message">Message</Label>
                                                                    <Input
                                                                        type="textarea"
                                                                        id="message"
                                                                        name="message"
                                                                        placeholder="Explain exactly what went wrong and try to provide as much information as possible."
                                                                        onChange={handleChange}
                                                                        value={values.message}
                                                                        className={errors.message && touched.message && "is-invalid"}
                                                                        rows={6}
                                                                    />
                                                                    {errors.message && touched.message && <div
                                                                        className="invalid-feedback">{errors.message}</div>}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                }
                                            </CardBody>

                                            <Button color="primary" type="submit" className="" style={{width: 200, margin: "0 auto"}}>
                                                Create ticket
                                            </Button>

                                        </Card>
                                    </Form>
                                )}
                            </Formik>
                        </Container>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.auth.profile
});

const mapDispatchToProps = (dispatch) => ({
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tickets))
