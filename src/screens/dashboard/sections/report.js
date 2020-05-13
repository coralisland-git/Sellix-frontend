import React from "react";
import NumberFormat from "react-number-format";
import Progress from "./progress";
import config from "constants/config";
import { Card, CardBody, Col } from "reactstrap";


export const ReportRevenue = ({ revenue=0, currency, revenue_progress, isAdmin }) => {
	return <Col lg={3}>
		<Card>
			<CardBody className="p-4 bg-white">
				<p className="report-title">{isAdmin ? "Cashflow" : "Revenue"}</p>
				<div className="d-flex justify-content-between align-items-center">
					<NumberFormat value={revenue} displayType={'text'} thousandSeparator={true} prefix={config.CURRENCY_LIST[currency]}
					              renderText={value => <h3 className="text-primary mb-0">{value || 0}</h3>}
					/>
					<Progress progress={revenue_progress} is24={true} isPositive={revenue_progress >= 0} />
				</div>

				<div className="progress-xs mt-3 progress">
					<div
						className={`progress-bar ${revenue_progress > 0 ? 'bg-success' : (+revenue_progress === 0 ? 'bg-warning' : 'bg-danger')}`}
						role="progressbar"
						style={{width: `${+revenue_progress === 0 ? 1 : Math.abs(revenue_progress)}%`}}
						aria-valuemin="0"
						aria-valuemax="100"
					/>
				</div>

			</CardBody>
		</Card>
	</Col>
}

export const ReportViews = ({ views_count, views_count_progress }) => {
	return <Col lg={3}>
		<Card>
			<CardBody className="p-4 bg-white">
				<p className="report-title">Views</p>
				<div className="d-flex justify-content-between align-items-center">
					<h3 className="text-primary mb-0">{views_count}</h3>
					<Progress progress={views_count_progress} is24={true} isPositive={views_count_progress>=0} />
				</div>
				<div className="progress-xs mt-3 progress">
					<div
						className={`progress-bar ${+views_count_progress>0 ? 'bg-success' : (+views_count_progress === 0 ? 'bg-warning':'bg-danger' )}`}
						role="progressbar"
						style={{width: `${+views_count_progress === 0 ? 1 : Math.abs(views_count_progress)}%`}}
						aria-valuemin="0"
						aria-valuemax="100"/>
				</div>
			</CardBody>
		</Card>
	</Col>
}
export const ReportOrders = ({ orders_count, orders_count_progress }) => {
	return <Col lg={3}>
		<Card>
			<CardBody className="p-4 bg-white">
				<p className="report-title">Orders</p>
				<div className="d-flex justify-content-between align-items-center">
					<h3 className="text-primary mb-0">{orders_count}</h3>
					<Progress progress={orders_count_progress} is24={true} isPositive={orders_count_progress >= 0} />
				</div>
				<div className="progress-xs mt-3 progress">
					<div
						className={`progress-bar ${orders_count_progress > 0 ? 'bg-success' : (+orders_count_progress === 0 ? 'bg-warning' : 'bg-danger')}`}
						role="progressbar"
						style={{width: `${orders_count_progress === 0 ? 1 : Math.abs(orders_count_progress)}%`}}
						aria-valuemin="0"
						aria-valuemax="100"/>
				</div>
			</CardBody>
		</Card>
	</Col>
}
export const ReportQueries = ({ queries_count, queries_count_progress }) => {
	return <Col lg={3}>
		<Card>
			<CardBody className="p-4 bg-white">
				<p className="report-title">Queries</p>
				<div className="d-flex justify-content-between align-items-center">
					<h3 className="text-primary mb-0">{queries_count}</h3>
					<Progress progress={queries_count_progress} is24={true} isPositive={queries_count_progress >= 0} />
				</div>
				<div className="progress-xs mt-3 progress">
					<div
						className={`progress-bar ${queries_count_progress > 0 ? 'bg-success' : (+queries_count_progress === 0 ? 'bg-warning' : 'bg-danger')}`}
						role="progressbar"
						style={{width: `${queries_count_progress === 0 ? 1 : Math.abs(queries_count_progress)}%`}}
						aria-valuemin="0"
						aria-valuemax="100" />
				</div>
			</CardBody>
		</Card>
	</Col>
}

export const ReportFee = ({ fee_revenue = 0, fee_revenue_potential = 0, potential, currency }) => {
	let fee = potential ? fee_revenue_potential : fee_revenue;

	return <Col lg={3}>
		<Card>
			<CardBody className="p-4 bg-white">
				<p className="report-title">Site Revenue</p>
				<div className="d-flex justify-content-between align-items-center">
					<NumberFormat value={fee.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={config.CURRENCY_LIST[currency]}
					              renderText={value => <h3 className="text-primary mb-0">{value}</h3>}
					/>
					&nbsp;
				</div>
				<div className="progress-xs mt-3 progress">
					<div
						className={`progress-bar ${fee > 0 ? 'bg-success' : 'bg-warning'}`}
						role="progressbar"
						style={{width: "100%"}}
						aria-valuemin="0"
						aria-valuemax="100" />
				</div>
			</CardBody>
		</Card>
	</Col>
}