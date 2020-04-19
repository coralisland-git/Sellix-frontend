import { Link } from "react-router-dom";
import React from "react";

const StockInfo = ({ productInfo }) => {

	const getProductStock = (({ type, file_stock, stock, service_stock }) => {
		switch (type) {
			case 'file':
				return file_stock === '-1' ? '∞' : file_stock
			case 'serials':
				return stock === '-1' ? '∞' : stock
			case 'service':
				return service_stock === '-1' ? '∞' : service_stock
		}
	})(productInfo)

	return  <div className="stock-info p-2">
		<div className="d-flex justify-content-between p-2">
			<span className="text-primary">Seller</span>
			<span className="text-primary bold">
        <Link className="bold" to={`/${productInfo.username}`}>{productInfo.username || ''}</Link>
      </span>
		</div>
		<div className="d-flex justify-content-between p-2">
			<span className="text-primary">Stock</span>
			<span className="text-primary bold">{getProductStock}</span>
		</div>
		<div className="d-flex justify-content-between p-2">
			<span className="text-primary">Feedback</span>
			<span className="text-primary bold">{productInfo.feedback && productInfo.feedback.total}</span>
		</div>
	</div>
}

export default StockInfo;