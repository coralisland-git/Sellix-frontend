import React, { useState, useReducer, useMemo, useEffect } from 'react';
import FlipMove from 'react-flip-move';
import ProductCard from './productCard';
import GroupCard from './groupCard';
import { Loader } from 'components';
import { Row } from 'components/reactstrap'
import GroupModal from './screens/group_detail'
import { getProductStock } from 'screens/product_shop/productCard';
import InfiniteScroll from 'react-infinite-scroll-component';

import './style.scss'


const ProductsList = ({ products, groups, loading, history, hide_out_of_stock, center_product_titles, center_group_titles }) => {

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [croppedProducts, setCroppedProducts] = useState(40)

	const total = products.length;

	const data = useMemo(() => {
		if(hide_out_of_stock === 1) {
			products = products.filter(product => getProductStock(product) != 0)
		}

		if(total > 40 && !history.location.pathname.includes('category')) {
			return products.slice(0, croppedProducts).filter(p => p.unlisted !== "1")
		} else {
			return products.filter(p => p.unlisted !== "1")
		}

	}, [products, croppedProducts]);

	useEffect(() => {
		setCroppedProducts(40)
	}, [history.location.pathname.includes('category')]);

	if(!products.length && !groups.length) {
		return <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>
	}

	if(loading) {
		return <Loader />
	}

	console.log(data.length, croppedProducts)

	return (
		<Row>
			{total > 40 ?
				<FlipMove className={"d-flex flex-wrap w-100"} duration={300}>
					<InfiniteScroll dataLength={data.length} next={() => setCroppedProducts(croppedProducts + 40)} hasMore={total > croppedProducts} loader={<Loader/>}>

						{groups.map(group =>
							<div key={group.uniqid} className="mb-4 col-md-6 col-lg-3">
								<GroupCard group={group} history={history} onClick={() => setSelectedGroup(group)} center_group_titles={center_group_titles}/>
							</div>
						)}

						{data.map(product =>
							<div key={product.uniqid} className="mb-4 col-md-6 col-lg-3">
								<ProductCard product={product} history={history} center_product_titles={center_product_titles} />
							</div>
						)}

					</InfiniteScroll>
				</FlipMove> :
				<FlipMove className={"d-flex flex-wrap w-100"} duration={300}>
					{groups.map(group =>
						<div key={group.uniqid} className="mb-4 col-md-6 col-lg-3">
							<GroupCard group={group} history={history} onClick={() => setSelectedGroup(group)} center_group_titles={center_group_titles}/>
						</div>
					)}

					{data.map(product =>
						<div key={product.uniqid} className="mb-4 col-md-6 col-lg-3">
							<ProductCard product={product} history={history} center_product_titles={center_product_titles} />
						</div>
					)}
				</FlipMove>
			}

			{ selectedGroup &&
				<GroupModal
					group={selectedGroup}
					hide_out_of_stock={hide_out_of_stock}
					className="group-modal"
					onGoBack={() => {
						document.querySelector('.group-modal').remove()
						document.querySelector('.fade.show').remove()
						document.querySelector('.fade.show').remove()
						setSelectedGroup(null)
					}}
					onProductSelect={product => history.push(`/product/${product.uniqid}`)}
				/>
			}
		</Row>
	)
}

export default ProductsList
