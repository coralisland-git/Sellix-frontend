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
import * as Actions from '../shop_design/actions'

import '../shop_design/style.scss'

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

      google_analytics_tracking_id: this.state.google_analytics_tracking_id
    }

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

        google_analytics_tracking_id: settings.shop_google_analytics_tracking_id || ''
      })
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const { loading, google_analytics_tracking_id } = this.state;

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
                        <h4 className="title">Analytics</h4>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label>Google Analytics Tracking ID</Label>
                            <Input 
                              type="text" 
                              placeholder="UA-123456-1"  
                              value={google_analytics_tracking_id}
                              onChange={e => this.setState({google_analytics_tracking_id: e.target.value})}
                            />
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