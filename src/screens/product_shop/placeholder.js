import React from 'react'
import { Card, CardHeader, Row, Col } from 'reactstrap'
import range from "lodash/range";

import './style.scss'


class Placeholder extends React.Component {

	render() {

		return (
			<Card className="grey">

				<CardHeader className="pb-1 pt-3">
					<Row>
						<Col md={12} className="filter-button d-flex flex-wrap mb-4">
							{range(5).map((i) => (
								<div key={i} style={{ height: "38px", width: "150px",  marginBottom: "5px", borderRadius: "3px"}} className={"placeholder-loading mr-2"} />
							))}
						</Col>

						<Col md={12} className="mb-4">
							<div className="d-flex justify-content-start">
								<div className="searchbar white w-100">
									<div style={{ height: "45px", borderRadius: "3px" }} className={"placeholder-loading w-100"} />
								</div>
							</div>
						</Col>
					</Row>
				</CardHeader>

				<div className="p-0">
					<Row>
						{range(8).map((i) => (
							<Col md="3" className="mb-4" key={i}>
								<div style={{ borderRadius: "3px" }} className={"placeholder-card d-flex flex-column"}>
									<div style={{ height: "150px" }}  className={"placeholder-loading"} />
									<div className={"p-3 d-flex flex-column"} >
										<div style={{ height: "10px" }} className={"placeholder-loading flex-grow-1 flex-shrink-1 mb-2"} />
										<div style={{ height: "10px" }} className={"placeholder-loading flex-grow-1 flex-shrink-1 mb-4 pb-2"} />
										<div style={{ height: "15px" }} className={"placeholder-loading flex-grow-1 flex-shrink-1"} />
									</div>
								</div>
							</Col>
						))}
					</Row>
				</div>

			</Card>
		)
	}
}

export default Placeholder
