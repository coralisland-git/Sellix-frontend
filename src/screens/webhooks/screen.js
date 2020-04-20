import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  ButtonGroup,
  Input
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { getWebhookList } from './actions'
import moment from 'moment'
import './style.scss'


const user = window.localStorage.getItem('userId')


const mapStateToProps = (state) => {
  return ({
    webhook_list: state.webhooks.webhook_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getWebhookList }, dispatch)    
  })
}

class Webhooks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search_key: null
    }    
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })    
    this.props.actions.getWebhookList().catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  }


  renderStatus (cell, row) {
    if (
      row.response_code
    ) {
      return (
        <div className={`badge badge-${row.response_code.toLowerCase()}`}>
          {row.response_code}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderOptions(cell, row) {
    return (
      <div className="d-flex actions">
        <a>
          <i className="fas fa-pen"/>
        </a>
        <a>
          <i className="fas fa-trash"/>
        </a>
      </div>
    )
  }

  renderPayload(cell, row) {
    return(
      <div className="badge badge-payload">
        Payload
      </div>
    )
  }

  renderOrderTime(cell, row) {
    return (
      <div>
        <p>{new moment(new Date(row.created_at*1000)).format('DD, MMM YYYY')}</p>
        <p>{new moment(new Date(row.created_at*1000)).format('HH:mm')}</p>
      </div>
    )  
  }

  searchWebhooks = (webhooks) => {
    const { search_key } = this.state
    const search_fields = ['url', 'event']

    const data = webhooks.filter(product => {
      for(let i=0; i<search_fields.length; i++)
        if(product[search_fields[i]] && product[search_fields[i]].includes(search_key))
          return true
      return false
    })

    return data
  }

  render() {
    const { loading, search_key } = this.state    
    const webhook_list = search_key?this.searchWebhooks(this.props.webhook_list):this.props.webhook_list

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Webhooks</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search..." 
                        className="header-search-input"
                        onChange={(e) => {
                          this.setState({search_key: e.target.value})
                        }}
                      />
                    </div>
                    <Button className="ml-3" color="primary" onClick={() => this.props.history.push(`/dashboard/${user}/developer/webhooks/new`)}>
                      Simulator</Button>
                  </div>
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
                  <Row>
                    <Col lg={12}>
                      <div>
                        <BootstrapTable                          
                          options={{...tableOptions(), onRowClick: (row) => {
                              this.gotoDetail(row.uniqid)}, sizePerPage: 15
                            }}
                          data={webhook_list}
                          version="4"
                          pagination
                          totalSize={webhook_list ? webhook_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="url"
                            dataSort
                            width='35%'
                          >
                            Webhook URL
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="event"
                            dataSort
                            dataAlign="center"
                            width='13%'
                          >
                            Event
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="response_code"
                            dataSort
                            dataFormat={this.renderStatus}
                            dataAlign="center"
                            width='13%'
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="attempts"                            
                            dataSort
                            dataAlign="center"
                            width='13%'
                          >
                            Attempts
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="payload"
                            width='13%'
                            dataAlign="center"
                            dataFormat={this.renderPayload}
                          >
                            Payload
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="created_at"
                            dataAlign="right"
                            width='13%'
                            dataAlign="right"
                            dataFormat={this.renderOrderTime}
                          >
                            Created at
                          </TableHeaderColumn>
                          {/*<TableHeaderColumn
                              dataField="id"
                              dataAlign="right"
                              dataFormat={this.renderOptions}
                              width='15%'
                              dataAlign="right"
                            >
                              Options
                            </TableHeaderColumn>*/}
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Webhooks)
