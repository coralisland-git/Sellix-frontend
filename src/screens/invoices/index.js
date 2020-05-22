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
} from 'components/reactstrap'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { getInvoices } from './actions'

import './style.scss'


const mapStateToProps = (state) => ({
  invoices: state.invoices.invoices
})

const mapDispatchToProps = (dispatch) => ({
  getInvoices: bindActionCreators(getInvoices, dispatch),
})

class Invoices extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getInvoices()
        .finally(() => this.setState({ loading: false }))
  }

  renderUserUsername = (cell, row) => row.username ? <div>{row.username}</div> : <p className="caption">No specified</p>

  renderUserId = (cell, row) => row.uniqid ? <div>{row.uniqid}</div> : <p className="caption">No specified</p>

  renderUserEmail = (cell, row) => row.customer_email ? <div>{row.customer_email}</div> : <p className="caption">No specified</p>

  renderDate = (cell, row) => row.day ? <div>{row.day_value} - {row.day} - {row.month} - {row.year}</div> : <p className="caption">No specified</p>

  viewInvoice = (e, id) => this.props.history.push(`/admin/invoices/${id}`)

  renderOption =  (cell, row) => <Button color="default" onClick={(e) => this.viewInvoice(e, row.uniqid)}>View</Button>


  render() {

    const { loading } = this.state
    const { invoices } = this.props;

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4}>
                  <h1>Invoices</h1>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              {loading && <Row><Col lg={12}><Loader /></Col></Row>}
              {!loading &&
                  <Row>
                    <Col lg={12}>
                      <div>
                        <BootstrapTable
                          options={tableOptions()}
                          data={invoices}
                          version="4"
                          pagination
                          totalSize={invoices ? invoices.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="id"
                            width='20%'
                            dataSort
                            dataFormat={this.renderUserId}
                          >
                            ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataSort
                            width="20%"
                            dataFormat={this.renderUserEmail}
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="username"
                            dataSort
                            width="20%"
                            dataFormat={this.renderUserUsername}
                          >
                            Username
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="updated_at"
                            dataSort
                            width="20%"
                            dataFormat={this.renderDate}
                          >
                            Date
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            width="20%"
                            dataAlign="right"
                            dataFormat={this.renderOption}
                          >
                            Option
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

export default connect(mapStateToProps, mapDispatchToProps)(Invoices)
