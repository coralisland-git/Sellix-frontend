import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button
} from 'reactstrap'
import * as _ from 'lodash'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'
import { getSettings } from './actions'


const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    settings: state.settings.settings
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getSettings }, dispatch),
    
  })
}


class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }

    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount() {
    // this.initializeData()
    this.props.actions.getSettings()
  }

  initializeData() {
    // this.props.productActions.getProductList().then(res => {
    //   if (res.status === 200) {
    //     this.setState({ loading: false })
    //   }
    // })

    this.props.productActions.getProductList()
    this.setState({ loading: false })
  }

  renderSettings = () => {
    return _.map(this.props.settings, (value, key) => {
      return <><div className="settingRow">
        <div className='settingRowKey'>{key}:</div>
        <div>{value }</div>
      </div>
      </>
    })
  }

  editSettings = () => {
    this.props.history.push({
      pathname: `/admin/settings/edit`
    })
  }


  render() {
    const { loading } = this.state
    const { product_list } = this.props
    console.log({stng: this.props.settings}, JSON.stringify(this.props.settings))
    if(!this.props.settings){return null}
    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4} className="settings-titleBlock">
                  <h1>Settings</h1>
                  <Button color="primary" onClick={() => this.editSettings()} className="mt-4 mb-3">Edit</Button>
                </Col>
              </Row>
              
            </CardHeader>
            <CardBody className="p-0">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                  :
                  this.renderSettings()
              }
              
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
