import React, { Component } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import IntervalTimer from 'react-interval-timer'
import {Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Input} from 'reactstrap'
import {Button, Spin, Loader} from 'components';
import {Formik} from 'formik'
import { replyToQuery, getQuery, getQueryViaWebsocket } from '../../actions'
import {CommonActions} from 'services/global'
import * as moment from 'moment/moment'

import '../../../queries/screens/reply/style.scss'



const RenderMessage = ({ role, message, created_at }) => (
    <div className={role === 'customer' ? 'alignForYou' : 'alignForCustomer'}>
        <div className='queryMessageBlock'>
            <div className={"d-flex align-items-center w-100 mb-3"}>
                <div className='queryMessageTitle mr-2'>{role === 'customer' ? 'You' : 'Customer'}</div>
                <div className='queryMessageDate'>({moment(created_at * 1000).format("DD, MMM HH:mm")})</div>
            </div>
            <span><i>{message}</i></span>
        </div>
    </div>
)

class ReplyToQuery extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            messages: [],
            reply: false,
            isActive: true
        }

        this.id = this.props.match.params.id;
        this.messageReceived = null;
        this.title = 'Contact | Sellix';
        document.title = this.title;
    }

    componentDidMount() {
        this.getQuery();
        document.title = this.title;
        window.addEventListener('focus', () => {
            this.setState({
                isActive: true
            })
        });
        window.addEventListener('blur', () => {
            this.setState({
                isActive: false
            })
        });
        document.addEventListener("visibilitychange", () => {
            clearInterval(this.messageReceived);
            document.title = this.title;
        })
    }

    componentWillUnmount() {
        clearInterval(this.messageReceived);
        document.removeEventListener("visibilitychange", () => {
            document.title = this.title;
        })
        window.removeEventListener("focus", () => {
            document.title = this.title;
        })
        window.removeEventListener("blur", () => {
            document.title = this.title;
        })
    }

    componentDidUpdate(prevProps, prevState) {

        let { messages, isActive } = this.state;
        let isCustomer = messages.length && messages.lastItem.role === "customer"

        if(prevState.messages.length && !isCustomer && !isActive && (prevState.messages.length !== messages.length)) {
            this.messageReceived = setInterval(() => {
                document.title = document.title === `(New) ${this.title}` ?  this.title : `(New) ${this.title}`;
            }, 300);
        }
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

        this.setState({ reply: true });

        let { tostifyAlert, replyToQuery } = this.props;

        console.log(values)

        replyToQuery({...values, uniqid: this.id})
            .then(res => {
                tostifyAlert('success', res.message);
                resetForm({ message: ""})
                this.getQuery()
            })
            .catch(err => {
                this.getQuery()
                tostifyAlert('error', err.error)
            })
            .finally(() => this.setState({reply: false}))
    }

    render() {

        let {loading, messages, reply} = this.state;
        return (
            <div className="reply-screen mt-3">
                <div className="animated fadeIn">

                    <IntervalTimer timeout={3000} callback={this.getQueryViaWebsocket} enabled={true} repeat={true}/>

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
    getQueryViaWebsocket: bindActionCreators(getQueryViaWebsocket, dispatch)
})


export default connect(null, mapDispatchToProps)(ReplyToQuery)
