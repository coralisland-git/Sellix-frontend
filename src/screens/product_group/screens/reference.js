import React from "react";
import { Col } from "components/reactstrap";

const Reference = () => (
	<Col lg={3} className="p-0">
		<div className="page_description_card bg-grey p-3 mr-2">
			<h6 className="text-grey mb-3">REFERENCE</h6>
			<p className="page_description text-grey">
				Product Groups let you organize all your items in your shop page.
				<br/>
				<br/>
				They are displayed like normal products, with a card containing the image chosen, a group badge and the starting price for the cheapest product in it.
				<br/>
				<br/>
				Once selected, a menu will be prompted asking to choose one of the products the group has, then the customer will be redirected to the classic purchase product page.
				<br/>
				<br/>
				In order to create a group, please fill its Title, select which products should be contained in it and give it an image!
			</p>
		</div>
	</Col>
)

export default Reference;