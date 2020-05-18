import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col, Navbar, Collapse, Container } from 'components/reactstrap'
import { Loader } from 'components'
import { getSettings as fetchSettings, updateSettings } from './actions'
import { CommonActions } from 'services/global'
import { Route, NavLink } from "react-router-dom";
import Settings from "./settings";
import Status from "./status";

import './style.scss';


const Nav = () => {
  return <ul className="nav">
    <li className="nav-item"><NavLink to={('/admin/settings/general' || '/admin/settings')} style={{ height: "32px" }} className="nav-link" activeClassName={"active"}>General</NavLink></li>
    <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/bitcoin">Bitcoin</NavLink></li>
    <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/litecoin">Litecoin</NavLink></li>
    <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/ethereum">Ethereum</NavLink></li>
    <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/b-cash">Bitcoin Cash</NavLink></li>
    <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/status">Status</NavLink></li>
  </ul>
}

class SettingContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showPlaceholder: false,
      settings: {}
    }
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.getSettings()
        .then((response) => {
          if(response.status === 401) {
            this.setState({ showPlaceholder: true })
          } else {
            this.setState({ settings: response })
          }
        })
        .finally(() => this.setState({ loading: false }))
  }

  handleSubmit = (values) => {
    this.setState({ loading: true });

    let updated = {
      ...this.state.settings,
      ...values
    }

    updated.email_validation_required = updated.email_validation_required ? "1" : "0";
    this.props.updateSettings(updated)
        .then(() => {
          this.props.tostifyAlert('success', "Settings Update Succeeded")
          this.initializeData()
        })
        .catch(() => {
          this.props.tostifyAlert('error', 'Settings Update Failed')
        })
        .finally(() => {
          this.setState({ loading: false })
        });
  }


  render() {

    const { loading, showPlaceholder, isOpen, settings } = this.state;

    return (
        <div className={"settings-main"}>
          <Container fluid>

            <Row className={"mt-3"}>
              <Col lg={3}>
                <div>
                  <div className="settings-sidebar mb-4 mt-4 p-4">
                    <Navbar expand="xs" className="p-0">
                      <Collapse className="mr-5" isOpen={isOpen} navbar>
                        <div>
                          <h4 style={{ color: 'black', fontSize: '16px' }} className={"mb-3"}>Admin Settings</h4>
                          <Nav />
                        </div>
                      </Collapse>
                    </Navbar>
                  </div>
                </div>
              </Col>

              <Col lg={9}>
                <div className="p-0 mt-4">
                  <div>
                    <div className="animated fadeIn">
                      <Card className="grey mb-0">
                        <CardBody className="p-4 position-relative"  style={{ minHeight: "10rem" }}>
                          {loading && <div className={"loader-container"}><Loader /></div>}

                          {(!loading && showPlaceholder) ?
                              <div className={'unauthorized-container'}>
                                <div>
                                  <Loader className={"override-loader"} />
                                  <div>Unauthorized to view this content</div>
                                </div>
                              </div>
                              :
                              <Row>
                                <Col lg={12}>
                                  <Route exact={true} path={"/admin/settings"} render={props => <Settings type="general" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"General Information"}/>} />
                                  <Route path={"/admin/settings/general"} render={props => <Settings type="general" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"General Information"}/>} />
                                  <Route path={"/admin/settings/bitcoin"} render={props => <Settings type="bitcoin" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"Bitcoin"}/>} />
                                  <Route path={"/admin/settings/litecoin"} render={props => <Settings type="litecoin" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"Litecoin"} />} />
                                  <Route path={"/admin/settings/b-cash"} render={props => <Settings type="bitcoincash" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"Bitcoin Cash"} />} />
                                  <Route path={"/admin/settings/ethereum"} render={props => <Settings type="ethereum" settings={settings} handleSubmit={this.handleSubmit} {...props} title={"Ethereum"} />} />
                                  <Route path={"/admin/settings/status"} render={props => <Status {...props} />}/>
                                </Col>
                              </Row>
                          }
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

          </Container>
        </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
  getSettings: bindActionCreators(fetchSettings, dispatch),
  updateSettings: bindActionCreators(updateSettings, dispatch),
})

export default connect(null, mapDispatchToProps)(SettingContainer)
