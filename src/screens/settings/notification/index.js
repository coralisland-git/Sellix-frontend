import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Spin } from 'components';
import { Card, CardBody, Row, Input, Col, Form, FormGroup, Label } from 'components/reactstrap'
import config from 'constants/config'
import AppSwitch from '@coreui/react/es/Switch'
import { CommonActions, AuthActions } from 'services/global'
import { Loader } from 'components'
import * as Actions from './actions'
import 'react-toastify/dist/ReactToastify.css'

import './style.scss'

import discordIcon from 'assets/images/discord.png'

const mapStateToProps = (state) => ({
  settings: state.auth.settings || {}
})
const mapDispatchToProps = (dispatch) => ({
  saveNotificationSettings: bindActionCreators(Actions.saveNotificationSettings, dispatch),
  getUserSettings: bindActionCreators(AuthActions.getUserSettings, dispatch),
  checkDiscordChannel: bindActionCreators(CommonActions.checkDiscordChannel, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
})

class Notification extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      webhook_enabled: false,
      webhook_url: '',
      discord_channel_id: '',
      invoice_notification: false,
      ticket_notification: false,
      feedback_notification: false,
      reply_notification: false,
    }
  }


  testDiscordChannel() {

    let { checkDiscordChannel, tostifyAlert } = this.props;

    checkDiscordChannel({
      channel_id: this.state.discord_channel_id
    })
        .then(res => tostifyAlert('success', "Discord Test Succeeded"))
        .catch(err => tostifyAlert('error', 'Discord Test Failed'))
  }


  connectDiscord() {
    window.open(config.DISCORD_CONNECT_URL, '_blank')
  }


  saveNotificationSettings() {
    this.setState({ loading: true });

    let { saveNotificationSettings, tostifyAlert } = this.props;

    saveNotificationSettings({
      notifications_invoices: this.state.invoice_notification,
      notifications_tickets: this.state.ticket_notification,
      notifications_feedback: this.state.feedback_notification,
      notifications_replies: this.state.reply_notification,
      webhook_enabled: this.state.webhook_enabled,
      webhook_url: this.state.webhook_url,
      discord_channel_id: this.state.discord_channel_id
    })
        .then(res => tostifyAlert('success', res.message))
        .catch(err => tostifyAlert('error', err.error || 'Something went wrong!'))
        .finally(() => this.setState({ loading: false }))
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.getUserSettings().then(res => {
      const settings = res.data.settings

      this.setState({
        invoice_notification: settings.notifications_invoices === '1',
        ticket_notification: settings.notifications_tickets === '1',
        feedback_notification: settings.notifications_feedback === '1',
        reply_notification: settings.notifications_replies === '1',
        webhook_enabled: settings.webhook_enabled === '1',
        webhook_url: settings.webhook_url,
        discord_channel_id: settings.discord_channel_id
      })
    }).finally(() => this.setState({loading: false}))
  }

  render() {
    const { 
      loading, 
      invoice_notification, 
      ticket_notification, 
      feedback_notification, 
      reply_notification,
      discord_channel_id
    } = this.state;

    return (
      <div className="notification-screen">
        <div className="animated fadeIn">
          <Card>
            <CardBody className={"position-relative"}>
              {loading &&
                <div className={"loader-container"}>
                  <Loader/>
                </div>
              }
                <Row>

                  <Col lg={12}>
                    <FormGroup className="mb-4">
                      <h4 className="title">Notifications</h4>
                    </FormGroup>

                    <Form className="mt-3">
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mx-1 file-switch mr-2"
                                style={{width: 50}}
                                variant={'pill'}
                                size="lg"
                                color={'primary'}
                                checked={invoice_notification}
                                onChange={(e) => this.setState({ invoice_notification: e.target.checked })}
                              />
                              <div className="ml-2">
                                <Label>Orders</Label>
                                <p>Receive an email when you make a new sale</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>

                  <Col lg={12}>
                    <Form className="mt-3">
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mx-1 file-switch mr-2"
                                style={{width: 50}}
                                variant={'pill'} 
                                color={'primary'}
                                         size="lg"
                                checked={ticket_notification}
                                onChange={(e) => this.setState({ ticket_notification: e.target.checked })}
                              />
                              <div className="ml-2">
                                <Label>Queries</Label>
                                <p>Receive an email when a query is created</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={12}>
                    <Form className="mt-3">
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mx-1 file-switch mr-2"
                                style={{width: 50}}
                                variant={'pill'} 
                                color={'primary'}
                                         size="lg"
                                checked={feedback_notification}
                                onChange={(e) => {
                                  this.setState({
                                    feedback_notification: e.target.checked
                                  })
                                }}
                                />
                              <div className="ml-2">
                                <Label>Feedback</Label>
                                <p>Receive an email when a feedback is created</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={12}>
                    <Form className="mt-3">
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mx-1 file-switch mr-2"
                                style={{width: 50}}
                                variant={'pill'} 
                                color={'primary'}
                                         size="lg"
                                checked={reply_notification}
                                onChange={(e) => {
                                  this.setState({
                                    reply_notification: e.target.checked
                                  })
                                }}
                                />
                              <div className="ml-2">
                                <Label>Replies</Label>
                                <p>Receive an email when a query is replied</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={12}>
                    <hr/>
                    <img src={discordIcon} width="200"/><br/>
                    <Button color="default" className="connect-discord" onClick={this.connectDiscord.bind(this)}>Connect</Button>
                    <FormGroup className="mt-3">
                      <label>Receive Sellix Notifications on your Discord Server. Enter your Channel ID below.</label>
                      <div className="d-flex input-group">
                        <Input type="text" placeholder="Discord Channel ID" 
                          value={discord_channel_id}
                          onChange={(e) => {
                            this.setState({discord_channel_id: e.target.value})
                          }}/>
                        <Button color="primary" onClick={this.testDiscordChannel.bind(this)} disabled={!discord_channel_id}>
                          Send Test</Button>
                      </div>
                    </FormGroup>
                  </Col>
                  {/* <Col lg={12}>
                    <hr/>
                    <label className="custom-checkbox custom-control payment-checkbox ">
                      <input 
                        className="custom-control-input"
                        type="checkbox"
                        id="paypal"
                        checked={webhook_enabled}
                        name="SMTP-auth"
                        onChange={(e) => {
                          this.setState({webhook_enabled: e.target.checked})
                        }}
                      />
                      <label className="custom-control-label" htmlFor="paypal">
                        Use global webhooks
                      </label>
                    </label>
                    <FormGroup className="mt-3">
                      <label>This will send webhooks for a handful of events that happen in your account.</label>
                      <Input 
                        type="text" 
                        placeholder="https://" 
                        value={webhook_url}
                        disabled={!this.state.webhook_enabled}
                        onChange={(e) => {
                          this.setState({webhook_url: e.target.value})
                        }}
                      />
                    </FormGroup>
                  </Col> */}
                </Row>

            </CardBody>
            <Button color="primary" className="mt-4" style={{width: 200}} onClick={this.saveNotificationSettings.bind(this)}>
              {loading ? <Spin/> : 'Save Settings'}
            </Button>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)