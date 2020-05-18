import React from "react";
import {Col, Row} from "components/reactstrap";
import BootstrapTable from "react-bootstrap-table/lib/BootstrapTable";
import {tableOptions} from "../../../constants/tableoptions";
import TableHeaderColumn from "react-bootstrap-table/lib/TableHeaderColumn";
import config from "../../../constants/config";

export default ({ revenue_by_gateway }) => {


	return <div className="pt-4">
		{!!revenue_by_gateway.length && <h5 className="mb-4 mt-4">Cashflow By Gateway</h5>}
		{!!revenue_by_gateway.length && <Row className={"mb-4"}>
			<Col lg={12}>
				<div className={"product-table"}>
					<BootstrapTable
						options={{
							...tableOptions(),
							sizePerPage: revenue_by_gateway.length
						}}
						data={revenue_by_gateway}
						version="4"
						striped
						totalSize={revenue_by_gateway.length}
						className="product-table"
						trClassName="cursor-pointer"
					>
						<TableHeaderColumn
							isKey
							dataField="gateway"
							dataFormat={(cell, row) => config.PAYMENT_OPTS[row.gateway]}
							dataSort
							width='33%'
						>
							Gateway
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="revenue"
							dataAlign="right"
							dataSort
							dataFormat={(cell, row) => `$ ${row.revenue}`}
							width='33%'
						>
							Cashflow
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="orders_count"
							dataAlign="right"
							dataFormat={(cell, row) => row.orders_count}
							dataSort
							width='33%'
						>
							Orders Count
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</Col>
		</Row>}
	</div>
}
