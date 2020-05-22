import {
	ShopProductDetail,
	ShopGroupDetail
} from 'screens'

const paymentRoutes = [
	{
		path: '/product/:id',
		name: 'ShopProductDetail',
		component: ShopProductDetail,
		exact: true
	},
	{
		path: '/group/:id',
		name: 'ShopGroupDetail',
		component: ShopGroupDetail,
		exact: true
	}
]

export default paymentRoutes