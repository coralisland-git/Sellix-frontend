import React from "react";
import { Col } from "components/reactstrap";

const Reference = () => (
	<Col lg={3} className="p-0">
		<div className="page_description_card bg-grey p-3 mr-2">
			<h6 className="text-grey mb-3">REFERENCE</h6>
			<p className="page_description text-grey mb-0">
				Using Categories is a way to separate different types of products.
				<br/>
				<br/>
				Unlike normal products, categories are displayed as smaller tabs above the search bar, they do not have an image.
				<br/>
				<br/>
				Once selected, every other product that does not belong to that category will disappear with a super cool animation and the customer will be able to better see what he wants to purchase.
				<br/>
				<br/>
				In order to create a category, please fill its title, select which products should be contained in it and then, you can proceed!
			</p>
		</div>
	</Col>
)

export default Reference;