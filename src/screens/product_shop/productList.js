import React, { useState } from 'react';
import FlipMove from 'react-flip-move';
import ProductCard from './productCard';
import GroupCard from './groupCard';
import { Loader } from 'components';
import GroupModal from './screens/group_detail/screen'

import './style.scss'




const ProductsList = ({ products, groups, loading, history }) => {

	const [selectedGroup, setSelectedGroup] = useState(null)

	if(loading) {
		return  <Loader />
	}
	if(!products.length && !groups.length) {
		return <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>
	}

	return (
		<FlipMove style={{ display: "flex", flexWrap: "wrap", width: "100%" }} duration={300}>
			{groups.map(group =>
				<div key={group.uniqid} className="mb-4 col-md-3">
					<GroupCard group={group} history={history} onClick={() => setSelectedGroup(group)}/>
				</div>
			)}
			{products.map(product =>
				<div key={product.uniqid} className="mb-4 col-md-3">
					<ProductCard product={product} history={history}/>
				</div> 
			)}
			{ selectedGroup && 
				<GroupModal group={selectedGroup} 
					className="group-modal"
					onGoBack={() => {
						document.querySelector('.group-modal').remove()
						document.querySelector('.fade.show').remove()
						document.querySelector('.fade.show').remove()
						setSelectedGroup(null)
					}} 
					onProductSelect={product => {
						history.push(`/product/${product.uniqid}`)
					}}/>}
		</FlipMove>
	)
}

export default ProductsList
