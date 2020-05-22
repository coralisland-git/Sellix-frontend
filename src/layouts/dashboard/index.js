import React, {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Container} from 'components/reactstrap'
import AppHeader from '@coreui/react/es/Header'
import {dashboardRoutes, adminRoutes} from 'routes'
import {AuthActions} from 'services/global'

import {Header, SetTitle} from 'components'
import Nav from './nav'
import initComponent from '../index'
import {adminNavigation} from 'constants/navigation'

import './style.scss'


class AdminLayout extends Component {

	constructor(props) {
		super(props);

		this.token = window.localStorage.getItem('accessToken');
		this.userId = window.localStorage.getItem('userId');
		this.isAdmin = props.location.pathname.includes('/admin/dashboard');
	}


	componentDidMount() {

		const {history, location, getSelfUser, logOut} = this.props;

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
						if (data.user.rank === "0") {
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
		const router = this.isAdmin ? adminRoutes : dashboardRoutes;

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
										redirect ?
											<Redirect from={path} to={pathTo} key={key}/> :
											<Route path={path} render={(props) => <SetTitle
												title={title}><Component {...props} /></SetTitle>} key={key}/>
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

export default initComponent(connect(null, mapDispatchToProps)(AdminLayout))
