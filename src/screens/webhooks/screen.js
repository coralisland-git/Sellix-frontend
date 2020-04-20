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
import { NewWebhookModal } from './sections'
import { CommonActions } from 'services/global';
import * as WebhooksActions from './actions'
import { confirmAlert } from 'react-confirm-alert';

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    webhook_list: state.webhooks.webhook_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    actions: bindActionCreators(WebhooksActions, dispatch)    
  })
}

const Confirm = ({ onClose, title, message, onDelete }) => {
  return <div className={"react-confirm-alert" + ` ${window.localStorage.getItem('theme') || 'light'}`}>
    <div className="react-confirm-alert-body">
      <h1>{title}</h1>
      <h3>{message}</h3>
      <div className="react-confirm-alert-button-group">
        <button onClick={() => {
          onDelete()
          onClose()
        }}>Yes, Delete it!</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  </div>
}

class Webhooks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      openModal: false,
      search_key: null,
      webhook: null
    }
    this.deleteWebhook = this.deleteWebhook.bind(this)
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

  onDeleteWebhook = (id) => () => {
    this.setState({ loading: true })
    this.props.actions.deleteWebhook({
      uniqid: id
    }).then(res => {
      this.props.actions.getWebhookList()
      this.props.commonActions.tostifyAlert('success', res.message || "Delete successfully" )
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Seomthing went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  };

  deleteWebhook = (e, id) => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You want to delete this webhook?',
      customUI:  (props) => <Confirm {...props} onDelete={this.onDeleteWebhook(id)}/>
    });
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

  renderOptions = (cell, row) => {
    return (
      <div className="d-flex actions">
        <a onClick={(e) => {
          this.setState({
            openModal: true,
            webhook: row
          })
        }}>
          <i className="fas fa-pen"/>
        </a>
        <a onClick={(e) => this.deleteWebhook(e, row.uniqid) }>
          <i className="fas fa-trash" />
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

  openNewWebhookModal() {
    this.setState({
      openModal: true,
      webhook: null
    })
  }

  closeNewWebhookModal() {
    this.setState({
      openModal: false,
      webhook: null
    })
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
    const { loading, openModal, search_key, webhook } = this.state
    const webhook_list = search_key?this.searchWebhooks(this.props.webhook_list):this.props.webhook_list

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <NewWebhookModal 
            openModal={openModal} 
            closeModal={this.closeNewWebhookModal.bind(this)}
            actions={this.props.actions}
            commonActions={this.props.commonActions}
            webhook={webhook}
          />
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Webhook Endpoints</h1>
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
                      Add Webhook Endpoint</Button>
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
                          data={webhook_list}
                          version="4"
                          pagination
                          totalSize={webhook_list ? webhook_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="id"
                            dataSort
                            width='15%'
                          >
                            ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="url"
                            dataSort
                            width='40%'
                          >
                            Webhook URL
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="events"
                            dataSort
                            dataAlign="center"
                            width='15%'
                          >
                            Events
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="created_at"
                            dataAlign="right"                            
                            width='15%'
                            dataFormat={this.renderOrderTime}
                          >
                            Created at
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataAlign="right"
                            dataFormat={this.renderOptions}
                            width='15%'                            
                          >
                            Options
                          </TableHeaderColumn>
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
