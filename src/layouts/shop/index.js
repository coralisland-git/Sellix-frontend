import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { Container, Nav, NavItem, Label, Card, 	Tooltip } from 'reactstrap'
import { AppHeader, AppFooter } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'

import { shopRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'
import LazyImage from "react-lazy-progressive-image";
import Sellix from '../../assets/images/user_placeholder.svg';

import GoogleAnalytics from './googleAnalytics'


import { LoaderFullscreen, Loading, NotFound } from 'components'

import Header from './header'

import './style.scss'
import verifiedIcon from 'assets/images/sellix_verified.svg'
import LockIcon from 'assets/images/Lock.svg'
import config from "../../constants/config";

import LandingFooter from "../../layouts/landing/footer"

import '../../layouts/landing/style.scss'

const mapStateToProps = (state) => {
	return {
		version: state.common.version,
		user: state.common.general_info || {},
		profile: state.auth.profile || {},
		is_authed: state.auth.is_authed
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
		logOut: bindActionCreators(AuthActions.logOut, dispatch),
		setTostifyAlertFunc: bindActionCreators(CommonActions.setTostifyAlertFunc, dispatch),
		getGeneralUserInfo: bindActionCreators(CommonActions.getGeneralUserInfo, dispatch)
	}
}

class ShopLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			theme: 'light',
			verifiedTooltipOpen: false,
			userIsBanned: false,
			userIsNotFound: false
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {

		console.log(prevProps.user.username, this.props.user.username)
		if(prevProps.user.username !== this.props.user.username) {
			const theme = this.props.user.shop_dark_mode === '1' ? 'dark' : 'light';
			document.body.classList.remove('light');
			document.body.classList.remove('dark');
			document.body.classList.add(theme);

			document.documentElement.classList.remove('light')
			document.documentElement.classList.remove('dark')
			document.documentElement.classList.add(theme);
		}
	}

	componentWillUnmount() {
		if(window.$crisp && window.$crisp.on) {
			window.$crisp.do('chat:hide')
		}
	}

	componentDidMount() {

		const theme = 'dark';
		document.body.classList.remove('light');
		document.body.classList.remove('dark');
		document.body.classList.add(theme);

		document.documentElement.classList.remove('light')
		document.documentElement.classList.remove('dark')
		document.documentElement.classList.add(theme);

		document.title = `Products | Sellix`;
		const { username } = this.props.match.params;
		const { getGeneralUserInfo, getSelfUser, setTostifyAlertFunc } = this.props;

		if(window.$crisp && window.$crisp.on) {
			window.$crisp.do('chat:show')
		}

		getSelfUser();

		getGeneralUserInfo(username)
			.then(({ user }) => {
				if(user.shop_crisp_website_id) {
					window.$crisp = [];
					window.CRISP_WEBSITE_ID=user.shop_crisp_website_id;
					const script = document.createElement("script");
					script.src = "https://client.crisp.chat/l.js";
					script.type = 'text/javascript';
					script.async = true;
					script.id = "crisp";
					document.getElementsByTagName("head")[0].appendChild(script);
				}
			})
			.catch((e) => {
				console.log(e)
				if (e.status === 404) {
					this.setState({
						userIsNotFound: true
					})
				}
				if(e.status === 400) {
					if(e.error.includes('user has been banned')) {
						this.setState({
							userIsBanned: true
						})
						document.title = 'Banned User | Sellix'
					}
				}
			})


		setTostifyAlertFunc((status, message) => {
			if (!message) {
				message = 'Unexpected Error'
			}
			if (status === 'success') {
				toast.success(message, {
					position: toast.POSITION.TOP_RIGHT
				})
			} else if (status === 'error') {
				toast.error(message, {
					position: toast.POSITION.TOP_RIGHT
				})
			} else if (status === 'warn') {
				toast.warn(message, {
					position: toast.POSITION.TOP_RIGHT
				})
			} else if (status === 'info') {
				toast.info(message, {
					position: toast.POSITION.TOP_RIGHT
				})
			}
		})
	}

	verifiedTooltipToggle() {
		this.setState({verifiedTooltipOpen: !this.state.verifiedTooltipOpen})
	}

	render() {
		const containerStyle = {
			zIndex: 1999
		}

		const { pathname } = this.props.history.location;
		const { user } = this.props;
    	const userId = this.props.match.params.username;
		const theme = user.shop_dark_mode === '1' ? 'dark' : 'light'
		const { verifiedTooltipOpen, userIsBanned, userIsNotFound } = this.state;

		const dashboardUrl = user.username ? `/dashboard/${user.username}/home` : '/'

		var appBody

		if(userIsBanned) {
			appBody = <div style={{
				textAlign: 'center',
				margin: '100px'
			}}>
				<img src={LockIcon} width="150"/>
				<h1 className="text-primary" style={{marginTop: '50px'}}>User has been banned</h1>
			</div>
		} else if(userIsNotFound) {
			appBody = <div>
				<NotFound/>
			</div>
		} else {
			appBody = <div className="shop-content flex-column">
				<section className="pb-3">
					<div className="text-center align-items-center logo-content">
						<h4 className="mb-0 mt-3 mb-2">
							<span style={{fontSize: 20}}>{user.username}&nbsp;</span>
							{user.verified == '1' &&
								<span style={{fontSize: 17}}>
									<img src={verifiedIcon} width="20" className="verified-icon mb-1" id="verifiedTooltip" />
									<Tooltip
										placement="right"
										isOpen={verifiedTooltipOpen}
										target="verifiedTooltip"
										toggle={this.verifiedTooltipToggle.bind(this)}>
										This shop has verified its brand identity to Sellix.
									</Tooltip>
								</span>
							}
						</h4>
						<LazyImage placeholder={Sellix} src={user.profile_attachment}>
							{src => <img src={src} width="130" height="130" style={{ borderRadius: '50%' }} />}
						</LazyImage>
					</div>
					<Card
						className="report-count mb-3 mt-3 ml-auto mr-auto pt-1 pb-1 pl-3 pr-3 flex-row"
						style={{ width: 'fit-content' }}
					>
						<span className="text-green mr-2">
							{user.feedback ? user.feedback.positive : 0}
						</span>
						<span className="" />
						<span className="neutral-count pl-2 pr-2">
							{user.feedback ? user.feedback.neutral : 0}
						</span>
						<span className="" />
						<span className="text-red ml-2">
							{user.feedback ? user.feedback.negative : 0}
						</span>
					</Card>
					<div className="shop-navs">
						<Nav className="d-flex flex-row justify-content-center">
							<NavItem
								className="px-1"
								active={
									pathname == `/${userId}` ||
									pathname.includes(`/${userId}/category`)
								}
							>
								<NavLink to={`/${userId}`} className="nav-link">
									Products
								</NavLink>
							</NavItem>
							<NavItem
								className="px-1"
								active={pathname == `/${userId}/contact` || pathname.includes(`/${userId}/query`)}
							>
								<NavLink to={`/${userId}/contact`} className="nav-link">
									Contact
								</NavLink>
							</NavItem>
							<NavItem
								className="px-1"
								active={pathname == `/${userId}/feedback`}
							>
								<NavLink to={`/${userId}/feedback`} className="nav-link">
									Feedback
								</NavLink>
							</NavItem>
						</Nav>
					</div>
				</section>

				<div className="shop-section">
					<div className="shop-main p-3">
						<Container className="p-0" fluid>
							<Suspense fallback={Loading()}>
								<ToastContainer
									position="top-right"
									autoClose={5000}
									style={containerStyle}
								/>
								<GoogleAnalytics tracking_id={user.shop_google_analytics_tracking_id}>
									<Switch>
										{shopRoutes.map((prop, key) => {
											if (prop.redirect)
												return (
													<Redirect
														from={prop.path}
														to={prop.pathTo}
														key={key}
													/>
												)
											return (
												<Route
													path={prop.path}
													component={prop.component}
													key={key}
												/>
											)
										})}
									</Switch>
								</GoogleAnalytics>
							</Suspense>
						</Container>
					</div>
				</div>
			</div>
		}

		var appFooter

		if(userIsNotFound) {
			appFooter = <div className="landing-layout"><LandingFooter dashboardUrl={dashboardUrl} /></div>
		} else {
			appFooter = <AppFooter style={userIsBanned ? {
				position: 'fixed',
				bottom: 0,
				width: '100%'
			} : {}}>
				<p className="text-center text-grey footer-report py-4 m-0">
					Copyright by Sellix.io -{' '}
					<a href="mailto:abuse@sellix.io">Report Abuse</a>
				</p>
			</AppFooter>
		}

		const userIsLoading = Object.keys(user).length == 0;

		return (
			<ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
				<GlobalStyles />
				<LoaderFullscreen loaderRemovedInitially={!userIsLoading}/>
				<div className={'shop-container'}>
					<div className="app">
						<AppHeader>
							<Suspense fallback={Loading()}>
								<Header {...this.props} />
							</Suspense>
						</AppHeader>

						{appBody}

						{appFooter}
					</div>
				</div>
			</ThemeProvider>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopLayout)
