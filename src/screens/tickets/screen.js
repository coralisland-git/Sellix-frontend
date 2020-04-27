import React from 'react'
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap'
import { Button } from 'components';
import {Formik} from "formik";
import * as Yup from "yup";
import {Loader, Spin} from "../../components";
import Select from "react-select";
import {connect} from 'react-redux'
import {authApi} from "../../utils";
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

class Ticket extends React.Component {

    componentDidMount() {
        document.title = `Create Ticket | Sellix`;
        let isLoggedin = window.localStorage.getItem('userId')

        if(isLoggedin) {
            this.props.authActions.getSelfUser()
        } else {
            this.props.history.push('/')
        }
    }

    handleSubmit = async ({ subject, message, category }, { resetForm, setSubmitting }) => {

            const custom_id = 360006801217;
            const form = new FormData();
                    form.append('subject', subject || '');
                    form.append('message', message);
                    form.append('custom_id', custom_id);
                    form.append('custom_value', category.value);

             authApi.post('/zendesk/create', form)
                 .then(({ data, error }) => {
                     if (data && data.ticket) {
                         this.props.commonActions.tostifyAlert('success', "Your ticket has been created. Additional information have been sent to your email.");
                         resetForm({
                             message: "",
                             subject: "",
                             category: null,
                         })
                     } else {
                         console.log(data, error.details.base[0].description)
                         this.props.commonActions.tostifyAlert(
                             'error',
                             data || (error && error.details && error.details.base[0].description) || 'Seomthing went wrong!'
                         )
                     }
                 })
                 .catch((error) => {
                     this.props.commonActions.tostifyAlert('error', error || 'Seomthing went wrong!')
                     return error;
                 })
                 .finally(() => {
                     setSubmitting(false)
                 })
    }



    render() {

        let loading = false;
        let validationSchema = Yup.object().shape({
            category: Yup.object().shape({
                label: Yup.string(),
                value: Yup.string()
            }).nullable().required('Category is required'),
            subject: Yup.string().required('Subject is required'),
            message: Yup.string().required('The message fields is required')
        });

        return (
            <div className="ticket-screen light">
                <div className="animated fadeIn">

                    <div className="section text-center ">
                        <Container className="home-container" fluid>
                            <h1>Contact Us</h1>
                            <p className={'large'}>Explain your issue as detailed as possible</p>
                        </Container>
                    </div>

                    <div className="section bg-white" style={{ padding: "3rem 0 "}}>
                        <Container className="home-container">
                            <Formik onSubmit={this.handleSubmit} validationSchema={validationSchema}>
                                {({handleSubmit, values, errors, handleChange, touched, isSubmitting}) => (
                                    <Form onSubmit={handleSubmit}>
                                        {console.log(values)}
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
                                                                        onChange={(option) => handleChange("category")(option)}
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
                                                                        placeholder="Your subject here"
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
                                                                        placeholder="Let us know the reason why you are contacting us."
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

                                            {console.log(isSubmitting)}
                                            <Button color="primary" type="submit" className="" style={{width: 200, margin: "0 auto"}} disabled={isSubmitting}>
                                                {isSubmitting ? <Spin/> : 'Send Message'}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ticket))
