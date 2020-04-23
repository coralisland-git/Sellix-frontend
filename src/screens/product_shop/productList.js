import React from 'react';
import FlipMove from 'react-flip-move';
import ProductCard from './productCard';
import GroupCard from './groupCard';
import { Loader } from 'components';

import './style.scss'




const ProductsList = ({ products, groups, loading, history }) => {

	if(loading) {
		return  <Loader />
	}
	if(!products.length) {
		return <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>
	}

	return (
		<FlipMove style={{ display: "flex", flexWrap: "wrap", width: "100%" }} duration={300}>
			{groups.map(group =>
				<div key={group.uniqid} className="mb-4 col-md-3">
					<GroupCard group={group} history={history}/>
				</div>
			)}
			{products.map(product =>
				<div key={product.uniqid} className="mb-4 col-md-3">
					<ProductCard product={product} history={history}/>
				</div>
			)}
		</FlipMove>
	)
}

export default ProductsList
