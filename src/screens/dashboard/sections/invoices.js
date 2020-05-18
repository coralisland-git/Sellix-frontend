import React from "react";
import {Col, Row} from "components/reactstrap";
import BootstrapTable from "react-bootstrap-table/lib/BootstrapTable";
import {tableOptions} from "../../../constants/tableoptions";
import TableHeaderColumn from "react-bootstrap-table/lib/TableHeaderColumn";
import config from "../../../constants/config";
import * as moment from "moment";

const userId = window.localStorage.getItem('userId')

export default ({ invoices, history }) => {


	const gotoDetail = (id) => {
		history.push(`/dashboard/${userId}/orders/view/${id}`)
	}

	const renderOrderInfo = (cell, row) => <div>
		<p><a onClick={(e) => gotoDetail(row.uniqid)}>
			<i className={`flag-icon flag-icon-${row.country.toLowerCase()}`} title={row.location}>
			</i>&nbsp;&nbsp;&nbsp;{`${config.PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
		</p>
		<p className="caption">{row.uniqid} - {row.developer_invoice === '1' ? row.developer_title : row.product_title?row.product_title:row.product_id}</p>
	</div>

	const renderOrderStatus = (cell, row) => (<div>{config.PAYMENT_OPTS[row.gateway]}</div>)

	const renderOrderValue = (cell, row) => (<div className="order">
		<p className="order-value">{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
		<p className="caption">{row.crypto_amount ? (row.crypto_amount + ' ') : ''} {config.PAYMENT_OPTS[row.gateway]}</p>
	</div>)

	const renderOrderTime = (cell, row) => (<div>
		<p>{moment(row.created_at*1000).format('DD, MMM YYYY')}</p>
		<p>{moment(row.created_at*1000).format('HH:mm')}</p>
	</div>)


	return <>
		{!!invoices.length && <h5 className="mb-4 mt-4">Last 5 Orders</h5>}
		{!!invoices.length && <Row className={"mb-4"}>
			<Col lg={12}>
				<div className={"product-table"}>
					<BootstrapTable
						options={{
							...tableOptions(),
							onRowClick: (row) => gotoDetail(row.uniqid),
							sizePerPage: 5
						}}
						data={invoices}
						version="4"
						striped
						totalSize={invoices.length}
						className="product-table"
						trClassName="cursor-pointer"
					>

						<TableHeaderColumn
							isKey
							dataField="customer_email"
							dataFormat={renderOrderInfo}
							dataSort
							width='45%'
						>
							Info
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="total_display"
							dataAlign="center"
							dataSort
							dataFormat={renderOrderValue}
							width='20%'
						>
							Value
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="status"
							dataAlign="center"
							dataFormat={renderOrderStatus}
							dataSort
							width='20%'
						>
							Payment Gateway
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="created_at"
							dataAlign="right"
							dataFormat={renderOrderTime}
							dataSort
							width='15%'
						>
							Time
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</Col>
		</Row>}
	</>
}
