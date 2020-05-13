import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'components';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { confirmAlert } from 'react-confirm-alert';
import { getBlacklist, deleteFromBlacklist } from './actions'
import { CommonActions } from 'services/global'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    blacklist_list: state.blacklist.blacklist_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getBlacklist }, dispatch),
    deleteFromBlacklist: bindActionCreators({ deleteFromBlacklist }, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
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

class Blacklist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.renderOptions = this.renderOptions.bind(this)
    this.deleteFromBlacklist = this.deleteFromBlacklist.bind(this)
    this.gotoEditPage = this.gotoEditPage.bind(this)
  }

  componentDidMount() {
    this.props.actions.getBlacklist()
  }

  gotoEditPage(e, id) {
    this.props.history.push({
      pathname: `/dashboard/${user}/blacklist/edit/${id}`,
    })
  }

  onDeleteFromBlacklist = (id) => () => {
    this.setState({ loading: true })
    this.props.deleteFromBlacklist.deleteFromBlacklist({
      uniqid: id
    }).then(res => {
      this.props.actions.getBlacklist()
      this.props.commonActions.tostifyAlert('success', res.message)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  deleteFromBlacklist(e, id) {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You want to delete this user from blacklist?',
      customUI:  (props) => <Confirm {...props} onDelete={this.onDeleteFromBlacklist(id)}/>
    });
  }

  renderOptions(cell, row) {
    return (
      <div className="d-flex actions">
        <a onClick={(e) => this.gotoEditPage(e, row.uniqid)}>
          <i className="fas fa-pen" />
        </a>
        <a onClick={(e) => this.deleteFromBlacklist(e, row.uniqid)}>
          <i className="fas fa-trash" />
        </a>
      </div>
    )
  }

  renderBlacklistNote = (cell, row) => {
    if (row.note) {
      return (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {row.note}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderBlacklistData = (cell, row) => {
    if (
      row.data
    ) {
      return (
        <div>
          {row.data}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  render() {
    return (
      <div className="blacklist-screen mt-3">
        <div className="animated fadeIn">
          <div className='blacklist-header'>
            <h1 className='blacklist-title'>Blacklist</h1>
            <Button className="ml-3" color="primary"
            onClick={() => this.props.history.push(`/dashboard/${user}/blacklist/new`)}>Create blacklist</Button>
          </div>
          <BootstrapTable
            options={this.options}
            data={this.props.blacklist_list}
            version="4"
            striped
            totalSize={this.props.blacklist_list ? this.props.blacklist_list.length : 0}
            className="product-table"
            trClassName="cursor-pointer"
          >
            <TableHeaderColumn
              isKey
              dataField="type"
              dataFormat={this.renderBlacklistData}
              dataSort
              dataAlign="left"
              width='20%'
            >
              Blocked data
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="type"
              dataFormat={this.renderBlacklistNote}
              dataSort
              dataAlign="left"
              width='60%'
            >
              Note
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="stock"
              dataSort
              dataAlign="right"
              dataFormat={this.renderOptions}
              width='20%'
            >
              Options
            </TableHeaderColumn>
          </BootstrapTable>

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blacklist)
