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
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { NewWebhookLogModal, ShowWebhookLogModal } from './sections'
import { CommonActions } from 'services/global';
import * as WebhooksActions from './actions'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    webhook_log_list: state.webhookLogs.webhook_log_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    actions: bindActionCreators(WebhooksActions, dispatch)    
  })
}

class WebhookLogs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      openModal: false,
      openShowModal: false,
      search_key: null,
      webhook: {}
    }    
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })    
    this.props.actions.getWebhookLogList().catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  renderStatus (cell, row) {
    if (
      row.status
    ) {
      return (
        <div className={`badge badge-${row.status.toLowerCase()}`}>
          {row.status}
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

  renderPayload = (cell, row) => {
    return(
      <>
        <div className="badge badge-payload" 
          onClick={ ()=> this.setState({
            openShowModal: true,
            webhook: row
          })}
        >
          Payload
        </div>        
      </>
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

  openNewWebhookModal() {
    this.setState({openModal: true})
  }

  closeNewWebhookModal() {
    this.setState({openModal: false})
  }

  searchWebhookLogs = (webhooks) => {
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
    const { loading, openModal, search_key, openShowModal, webhook } = this.state    
    const webhook_log_list = search_key?this.searchWebhookLogs(this.props.webhook_log_list):this.props.webhook_log_list


    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <NewWebhookLogModal            
            openModal={openModal}
            closeModal={this.closeNewWebhookModal.bind(this)}
            actions={this.props.actions}
            commonActions={this.props.commonActions}
          />
          <ShowWebhookLogModal            
            openModal={openShowModal}
            webhook={webhook}
            closeModal={ ()=> this.setState({openShowModal: false})}            
          />
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
                    <Button className="ml-3" color="primary" onClick={this.openNewWebhookModal.bind(this)}>
                      Add Webhook Simulator</Button>
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
                          options={{...tableOptions(), sizePerPage: 15}}
                          data={webhook_log_list}
                          version="4"
                          pagination
                          totalSize={webhook_log_list ? webhook_log_list.length : 0}
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
                            dataField="retries"                            
                            dataSort
                            dataAlign="center"
                            width='13%'
                          >
                            Attempts
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField=""
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
                            dataFormat={this.renderOrderTime}
                          >
                            Created at
                          </TableHeaderColumn>
                          {/*<TableHeaderColumn
                              dataField="id"
                              dataAlign="right"
                              dataFormat={this.renderOptions}
                              width='15%'                              
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

export default connect(mapStateToProps, mapDispatchToProps)(WebhookLogs)
