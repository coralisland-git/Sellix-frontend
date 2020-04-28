import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import {Button, Spin} from 'components';
import { AppSwitch } from '@coreui/react'
import { CommonActions, AuthActions } from 'services/global'
import { Loader } from 'components'
import * as Actions from './actions'

import './style.scss'

const mapStateToProps = (state) => ({
  product_list: state.product.product_list
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
})


class Payments extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      discord_link: '',
      search_enabled: true,
      dark_mode: false,
      hide_out_of_stock: false,
      google_analytics_tracking_id: ''
    }
  }

  saveDesign(){
    this.setState({ loading: true });

    var settingsData = {
      discord_link: this.state.discord_link,
      search_enabled: this.state.search_enabled,
      dark_mode: this.state.dark_mode,
      hide_out_of_stock: this.state.hide_out_of_stock,
    }

    // if(this.state.google_analytics_tracking_id) {
    //   settingsData.google_analytics_tracking_id = this.state.google_analytics_tracking_id
    // }

    this.props.actions.saveShopSettings(settingsData)
      .then(res => this.props.commonActions.tostifyAlert('success', res.message))
      .catch(res => this.props.commonActions.tostifyAlert('error', res.error))
      .finally(() => this.setState({loading: false}))
  }


  componentDidMount() {
    this.setState({ loading: true })
    this.props.authActions.getUserSettings().then(res => {
      const settings = res.data.settings
      this.setState({
        discord_link: settings.shop_discord_link || '',
        search_enabled: settings.shop_search_enabled === '1',
        dark_mode: settings.shop_dark_mode === '1',
        hide_out_of_stock: settings.shop_hide_out_of_stock === '1',
        // google_analytics_tracking_id: settings.shop_google_analytics_tracking_id || ''
      })
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const { loading, discord_link, search_enabled, dark_mode, hide_out_of_stock, google_analytics_tracking_id } = this.state;

    return (
      <div className="shop-settings-screen">
        <div className="animated fadeIn">
          <Card>
            <CardBody className="p-4 mb-4 position-relative">
              {loading &&
              <div className={"loader-container"}>
                <Loader/>
              </div>
              }
                  <Row className="">
                    <Col lg={12}>
                      <FormGroup className="mb-4">
                        <h4 className="title">Design</h4>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="discord_link">Discord Link</Label>
                            <Input 
                              type="text" 
                              placeholder="Discord Link"  
                              value={discord_link}
                              onChange={e => this.setState({discord_link: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={search_enabled}
                                onChange={(e) => {
                                  this.setState({
                                    search_enabled: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Search Products</Label>
                                <p className="text-grey mb-0">
                                  Show the products searchbar in your shop, this option can be disabled to improve the design of your page.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={dark_mode}
                                onChange={(e) => {
                                  this.setState({
                                    dark_mode: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Dark Mode</Label>
                                <p className="text-grey mb-0">
                                Show your shop page with our dark theme.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={hide_out_of_stock}
                                onChange={(e) => {
                                  this.setState({
                                    hide_out_of_stock: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Hide Out of Stock</Label>
                                <p className="text-grey mb-0">
                                Automatically hide my products when out of stock</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

            </CardBody>
            <Button color="primary" className="mb-4" style={{ width: 200 }} onClick={this.saveDesign.bind(this)}>
              {loading ? <Spin/> : 'Save Settings'}
            </Button>
            
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)