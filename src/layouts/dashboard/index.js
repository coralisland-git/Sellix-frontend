import React, {Component} from 'react'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Container} from 'components/reactstrap'
import AppHeader from '@coreui/react/es/Header'
import {dashboardRoutes, adminRoutes} from 'routes'
import {AuthActions} from 'services/global'

import {Header, SetTitle} from 'components'
import Nav from './nav'
import layoutHOC from '../../HOC/layoutHOC'
import {adminNavigation} from 'constants/navigation'

import './style.scss'


class AdminLayout extends Component {

	constructor(props) {
		super(props);

		this.token = window.localStorage.getItem('accessToken');
		this.userId = window.localStorage.getItem('userId');
	}


	componentDidMount() {

		const {history, location, getSelfUser, logOut} = this.props;
		const { pathname } = location;

		let isAdmin = pathname.includes('/admin/dashboard') ||
		pathname.includes('/admin/users') ||
		pathname.includes('/admin/top') ||
		pathname.includes('/admin/settings') ||
		pathname.includes('/admin/invoices') ||
		pathname.includes('/admin/changelog')

		if (!this.token) {
			history.push('/auth/login')
		}

		if (this.token) {

			if (location.pathname === '/webhooks') {
				history.push(`/dashboard/${this.userId}/developer/webhooks/all`)
			}

			if (location.pathname === '/webhooks/simulate') {
				history.push(`/dashboard/${this.userId}/developer/webhooks/logs`)
			}

			getSelfUser()
				.then(({ status, data }) => {
					if (status === 200) {
						if (isAdmin && +data.user.rank < 0) {
							history.push(`/dashboard/${data.user.username}/home`)
						}
					} else {
						logOut()
						history.push('/auth/login')
					}
				})
				.catch(() => {
					logOut()
					history.push('/auth/login')
				})
		}

	}

	render() {

		const { location, theme, changeTheme } = this.props;
		const { pathname } = location;

		const isAdmin = pathname.includes('/admin/dashboard') ||
			pathname.includes('/admin/users') ||
			pathname.includes('/admin/top') ||
			pathname.includes('/admin/settings') ||
			pathname.includes('/admin/invoices') ||
			pathname.includes('/admin/changelog')

		const router = isAdmin ? adminRoutes : dashboardRoutes;

		return (
			<div className="admin-container">
				<div className="app">

					<AppHeader fixed className="border-bottom">
						<Header theme={theme} changeTheme={changeTheme}/>
					</AppHeader>

					<div className="app-body">
						<Nav location={location} nav={adminNavigation}/>
						<main className="main mb-5">
							<Container className="p-0 h-100" fluid>
								<Switch>
									{router.map(({path, pathTo, redirect, title, component: Component}, key) =>
										<Route path={path} render={(props) => <SetTitle title={title}><Component {...props} /></SetTitle>} key={key}/>
									)}
								</Switch>
							</Container>
						</main>

					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
	logOut: bindActionCreators(AuthActions.logOut, dispatch)
})

export default layoutHOC(connect(null, mapDispatchToProps)(AdminLayout))
