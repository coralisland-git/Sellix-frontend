import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Row,
  Col,
  Navbar,
  Collapse,
  Container,
  FormGroup,
  Label,
  Input,
  Form
} from 'reactstrap'
import { isEmpty, map } from 'lodash'
import { Loader, Button, Spin } from 'components'
import { getSettings as fetchSettings, updateSettings } from './actions'
import { CommonActions } from 'services/global'
import { Formik } from "formik";
import { NavLink } from "react-router-dom";

import './style.scss';


const mapStateToProps = ({ settings: { settings } }) => ({ settings })

const mapDispatchToProps = dispatch => ({
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
  getSettings: bindActionCreators(fetchSettings, dispatch),
  updateSettings: bindActionCreators(updateSettings, dispatch),
})

class Settings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showPlaceholder: false,
      isOpen: false,
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getSettings()
        .then(({ status }) => {
            if(status === 401) {
              this.setState({ showPlaceholder: true })
            }
        })
        .finally(() => this.setState({ loading: false }))
  }

  renderSettings = (settings, handleChange, values) => (
      map(settings, (value, key) => {
        if(key === "email_validation_required") {
          return <Col lg={12} key={key}>
            <FormGroup check className="mb-3 pl-0">
              <div className="custom-checkbox custom-control">
                <Input
                    className="custom-control-input"
                    type="checkbox"
                    id="email_validation_required"
                    name="email_validation_required"
                    onChange={(e) => handleChange('email_validation_required')(e.target.checked)}
                    checked={values.email_validation_required ? values.email_validation_required !== "0" : false}
                />
                <Label className="custom-control-label"  htmlFor="email_validation_required" check>
                  Email Validation Required
                </Label>
              </div>
            </FormGroup>
          </Col>
        } else if (key !== 'id') {
          return <Col lg={12} key={key}>
            <FormGroup className="mb-4">
              <Label htmlFor={key} style={{ textTransform: "capitalize" }}>{key.replaceAll("_", " ")}</Label>
              <Input
                  type="text"
                  id={key}
                  name={key}
                  placeholder={key.replaceAll("_", " ")}
                  onChange={handleChange}
                  value={values[key]}
              />
            </FormGroup>
          </Col>
        }
      })
  )

  handleSubmit = (values) => {
    this.setState({ loading: true })
    values.email_validation_required = values.email_validation_required ? "1" : "0";
    this.props.updateSettings(values)
        .then(() => {
          this.props.tostifyAlert('success', "Settings Update Succeeded")
        })
        .catch(() => {
          this.props.tostifyAlert('error', 'Settings Update Failed')
        })
        .finally(() => {
          this.setState({ loading: false })
        });
  }

  render() {

    const { loading, showPlaceholder, isOpen } = this.state;
    const { settings, location: { pathname } } = this.props;

    let bitcoin = {
      fee_fixed_bitcoin: settings.fee_fixed_bitcoin,
      change_address_bitcoin: settings.change_address_bitcoin,
      site_address_bitcoin: settings.site_address_bitcoin,
      transaction_fee_bitcoin: settings.transaction_fee_bitcoin,
    }
    let litecoin = {
      change_address_bitcoin: settings.change_address_bitcoin,
      fee_fixed_litecoin: settings.fee_fixed_litecoin,
      site_address_litecoin: settings.site_address_litecoin,
      transaction_fee_litecoin: settings.transaction_fee_litecoin,
    }
    let ethereum = {
      fee_fixed_ethereum: settings.fee_fixed_ethereum,
      site_address_ethereum: settings.site_address_ethereum,
      transaction_fee_ethereum: settings.transaction_fee_ethereum,
    }
    let bitcoincash = {
      fee_fixed_bitcoincash: settings.fee_fixed_bitcoincash,
      site_address_bitcoincash: settings.site_address_bitcoincash,
      transaction_fee_bitcoincash: settings.transaction_fee_bitcoincash,
    }
    let general = {
      fee_percentage: settings.fee_percentage,
      file_upload_maximum_size: settings.file_upload_maximum_size,
      main_directory: settings.main_directory,
      transaction_expire: settings.transaction_expire,
      email_validation_required: settings.email_validation_required,
    }

    return (
        <div className={"settings-main"}>
          <Container fluid>

            <Row>
              <Col lg={3}>
                <div>
                  <div className="settings-sidebar mb-4 mt-4 p-4">
                    <Navbar expand="xs" className="p-0">
                      <Collapse className="mr-5" isOpen={isOpen} navbar>
                        <div>
                          <h4 style={{ color: 'black', fontSize: '16px' }} className={"mb-3"}>Admin Settings</h4>
                          <ul className="nav">
                            <li className="nav-item"><NavLink to={'/admin/settings/general'} style={{ height: "32px" }} className="nav-link" activeClassName={"active"}>General</NavLink></li>
                            <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/bitcoin">Bitcoin</NavLink></li>
                            <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/litecoin">Litecoin</NavLink></li>
                            <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/ethereum">Ethereum</NavLink></li>
                            <li className="nav-item"><NavLink activeClassName={"active"} style={{ height: "32px" }} className="nav-link" to="/admin/settings/b-cash">Bitcoin Cash</NavLink></li>
                          </ul>
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
                      <Formik initialValues={settings} enableReinitialize={true} onSubmit={this.handleSubmit}>
                        {({ handleSubmit, handleChange, values, errors, touched}) => (
                            <Form onSubmit={handleSubmit}>
                              <Card className="grey">

                        <CardBody className="p-4 position-relative"  style={{ minHeight: "20rem" }}>
                          {loading && <div className={"loader-container"}><Loader /></div>}

                          {(!loading && isEmpty(settings) && showPlaceholder) ?
                            <div className={'unauthorized-container'}>
                              <div>
                                <Loader className={"override-loader"} />
                                <div>Unauthorized to view this content</div>
                              </div>
                            </div>
                              :
                              <Row>
                                <Col lg={12}>
                                  <Row>
                                    <Col lg={12}>
                                      <FormGroup>
                                        {pathname.includes('bitcoin') && <h4 className="mb-4">Bitcoin</h4>}
                                        {pathname.includes('litecoin') && <h4 className="mb-4">Litecoin</h4>}
                                        {pathname.includes('b-cash') && <h4 className="mb-4">Bitcoin Cash</h4>}
                                        {pathname.includes('ethereum') && <h4 className="mb-4">Ethereum</h4>}
                                        {(pathname.includes('general') || pathname === '/admin/settings') && <h4 className="mb-4">General Information</h4>}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    {pathname.includes('bitcoin') && this.renderSettings(bitcoin, handleChange, values)}
                                    {pathname.includes('litecoin') && this.renderSettings(litecoin, handleChange, values)}
                                    {pathname.includes('b-cash') && this.renderSettings(bitcoincash, handleChange, values)}
                                    {pathname.includes('ethereum') && this.renderSettings(ethereum, handleChange, values)}
                                    {(pathname.includes('general') || pathname === '/admin/settings') && this.renderSettings(general, handleChange, values)}
                                  </Row>
                                </Col>
                              </Row>
                          }
                        </CardBody>

                          {!(!loading && isEmpty(settings) && showPlaceholder) &&
                            <Col lg={12} className={"mt-4 p-0"}>
                              <Button color="primary" type="submit" className="" style={{width: 200}}>
                                {loading ? <Spin/> : 'Save Settings'}
                              </Button>
                            </Col>
                          }
                      </Card>
                            </Form>
                        )}
                      </Formik>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
