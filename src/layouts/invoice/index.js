import React from 'react'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Container} from 'components/reactstrap'
import AppFooter from '@coreui/react/es/Footer'
import AppHeader from '@coreui/react/es/Header'
import layoutHOC from '../../HOC/layoutHOC'

import {productRoutes, invoiceRoutes} from 'routes';
import {AuthActions} from 'services/global'

import {Header} from 'components'

import './style.scss'


class InvoiceLayout extends React.Component {

	componentDidMount() {

		document.title = `Products | Sellix`;

		this.props.getSelfUser()
			.then((res) => {
				const theme = res.data.user.shop_dark_mode === '1' ? 'dark' : 'light';
				document.body.classList.remove('light');
				document.body.classList.remove('dark');
				document.body.classList.add(theme);
			})
			.catch(() => {
				this.props.logOut()
			})
	}

	componentWillUpdate(prevProps, prevState) {
		console.log(this.props.user)
		const theme = this.props.user.shop_dark_mode === '1' ? 'dark' : 'light';
		document.body.classList.remove('light');
		document.body.classList.remove('dark');
		document.body.classList.add(theme);
	}

	render() {
		const {theme} = this.props;
		
		return (
			<div className="admin-container">
				<div className="app">
					<AppHeader fixed className="border-bottom">
						<Header theme={theme} isShop={true}/>
					</AppHeader>

					<div className="app-body mt-5 pt-5">
						<Container className="p-0 pt-3 pb-3">
							<Switch>
								{[...productRoutes, ...invoiceRoutes].map((prop, key) => <Route {...prop} key={key}/>)}
							</Switch>
						</Container>
					</div>

					<AppFooter className={"align-items-center justify-content-center"}>
						<p className="text-center text-grey footer-report py-4 m-0">
							Copyright by Sellix.io - <a href="mailto:abuse@sellix.io">Report Abuse</a>
						</p>
					</AppFooter>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.common.general_info || {}
})

const mapDispatchToProps = (dispatch) => ({
	getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
	logOut: bindActionCreators(AuthActions.logOut, dispatch),
})

export default layoutHOC(connect(mapStateToProps, mapDispatchToProps)(InvoiceLayout))
