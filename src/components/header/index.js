import React, {Component} from 'react'
import {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem,
	UncontrolledDropdown,
	Input,
	Badge
} from 'components/reactstrap'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import AppNavbarBrand from '@coreui/react/es/NavbarBrand'
import AppSidebarToggler from '@coreui/react/es/SidebarToggler'
import IntervalTimer from "react-interval-timer";
import sellix_logo from 'assets/images/Sellix_logo.svg'
import './style.scss'
import {AuthActions} from "../../services/global";

TimeAgo.addLocale(en);
const ReactTimeAgo = new TimeAgo('en-US');

const userId = window.localStorage.getItem('userId')


class Header extends Component {

	componentDidMount() {
		this.props.getUserNotificationsViaWebsocket()
	}

	signOut = () => {
		this.props.logOut()
		this.props.history.push('/')
	}

	setTheme = () => {
		this.props.changeTheme()
	}

	markAsRead = () => {
		this.props.markAsRead()
	}

	render() {
		const { notifications, profile, theme, is_authed, history, isDocumentation, isShop } = this.props;
		const path = history.location.pathname;

		return (
			<React.Fragment>
				<AppSidebarToggler className="d-lg-none" display="md" mobile/>
				<AppNavbarBrand className={`p-2 ${isShop ? '' : 'border-right'}`} href="/" full={{src: sellix_logo, width: 106, height: 25, alt: 'Sellix'}} />
				<IntervalTimer timeout={120000} callback={this.props.getUserNotificationsViaWebsocket} enabled={true} repeat={true}/>
				{isDocumentation ?
					<Nav className="ml-auto" navbar style={{flex: 1, justifyContent: 'flex-end'}}>
						<UncontrolledDropdown nav direction="down">
							<i style={{fontSize: 17}}
							   className={`fas fa-moon-o nav-icon moon-icon ${(theme || 'light') === 'light' ? 'dark-theme' : 'light-theme'}`}
							   onClick={this.setTheme.bind(this)}/>
						</UncontrolledDropdown>
					</Nav>
					:
					<Nav className="ml-auto" navbar style={{flex: 1, justifyContent: 'flex-end'}}>
						{
							!isShop &&
							<NavItem className="d-md-down-none mr-5" style={{flex: 3}}>
								<div className="searchbar">
									<i className="fas fa-search" style={{fontSize: 17}}/>
									<Input placeholder="Search..." className="header-search-input"/>
								</div>
							</NavItem>
						}

						{
							!isShop &&
							<UncontrolledDropdown nav direction="down">
								<i style={{fontSize: 17}}
								   className={`fas fa-moon nav-icon moon-icon ${(theme || 'light') === 'light' ? 'dark-theme' : 'light-theme'}`}
								   onClick={this.setTheme.bind(this)}/>
							</UncontrolledDropdown>
						}

						<UncontrolledDropdown nav direction="down" className="d-sm-down-none">
							<DropdownToggle className="user-name" nav>
								<i className="far fa-question-circle nav-icon"
								   style={{fontSize: 18, fontWeight: 'bold'}}/>
							</DropdownToggle>

							<DropdownMenu right className="mt-2">
								<DropdownItem onClick={() => history.push('/admin')}>
									Help Center
								</DropdownItem>
								<DropdownItem onClick={() => history.push('/contact')}>
									Contact Us
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>

						<UncontrolledDropdown nav direction="down" className="d-sm-down-none mr-3">
							<DropdownToggle className="user-name" nav>
								<i className="fas fa-bell nav-icon" style={{fontSize: 17}}/>
								{notifications && notifications.length > 0 &&
								<sup>
									<Badge color="danger" style={{color: 'white', padding: '6px', height: '19px'}}>
										{notifications.length}
									</Badge>
								</sup>
								}
							</DropdownToggle>

							<DropdownMenu right className="mt-2" style={{width: 300, maxHeight: 300, overflow: 'auto'}}>
								<DropdownItem>
									<div className="d-flex justify-content-between">
										<span className="text-primary d-flex">Notification</span>
										{
											(notifications && notifications.length > 0) &&
											<span className="d-flex text-grey"
											      onClick={this.markAsRead}>Mark as Read</span>
										}
									</div>
								</DropdownItem>

								{notifications && notifications.length > 0 ?
									notifications.map((notify, key) =>
										<DropdownItem key={key}>
											<div className="notification-row">
												<div className="d-flex justify-content-between align-items-end">
													<p className="title mb-0">{notify.title}</p>
													<span
														className="timeago">{ReactTimeAgo.format(notify.created_at * 1000)}</span>
												</div>
												<p className="message mb-0 text-grey">{notify.message}</p>
											</div>
										</DropdownItem>
									)
									:
									<DropdownItem>
										<p className="text-grey text-center pt-3">You have no notification.</p>
									</DropdownItem>
								}


							</DropdownMenu>
						</UncontrolledDropdown>

						<UncontrolledDropdown nav direction="down">
							<DropdownToggle className="user-name" nav>
								<div>
									{profile && profile.profile_attachment ?
										<img src={profile.profile_attachment} width="35" height="35"
										     style={{borderRadius: '50%'}} alt={"Sellix"}/> :
										<i className="fas fa-user-circle text-primary avatar-icon"/>
									}
								</div>
							</DropdownToggle>
							{
								is_authed ?
									<DropdownMenu right className="mt-3">
										{
											profile && profile.rank !== "0" &&
											<DropdownItem className={path.startsWith('/admin') ? 'active' : ''}
											              onClick={() => history.push(`/admin/dashboard`)}>
												<i className={path.startsWith('/admin') ? "far fa-dot-circle fa-md" : "far fa-circle fa-md"}/> Admin
												Panel
											</DropdownItem>
										}
										<DropdownItem className={path.startsWith('/dashboard') ? 'active' : ''}
										              onClick={() => this.props.history.push(`/dashboard/${userId}`)}>
											<i className={path.startsWith('/dashboard')?"nav-icon fas fa-home fa-lg":"nav-icon fas fa-home fa-lg"}/> Dashboard
										</DropdownItem>
										<DropdownItem className={isShop ? 'active' : ''}
										              onClick={() => this.props.history.push(`/${userId}`)}>
											<i className={isShop?"nav-icon fas fa-shopping-basket fa-lg" : "nav-icon fas fa-shopping-basket fa-lg"}/> Your
											Shop

										</DropdownItem>
										<DropdownItem className={path.startsWith('/settings') ? 'active' : ''}
										              onClick={() => this.props.history.push(`/settings/${userId}`)}>
											<i className={path.startsWith('/settings') ? "nav-icon fas fa-cog fa-lg" : "nav-icon fas fa-cog fa-lg"}/> Settings
										</DropdownItem>

										<DropdownItem onClick={() => this.signOut()}>
											<i className={path.startsWith('/signin') ? "fa fa-sign-out-alt" : "fa fa-sign-out-alt"}/> Sign
											Out
										</DropdownItem>
									</DropdownMenu> :
									<DropdownMenu right className="mt-2">
										<DropdownItem onClick={() => history.push(`/auth/login`)}>
											Log In
										</DropdownItem>
									</DropdownMenu>
							}

						</UncontrolledDropdown>

					</Nav>
				}
			</React.Fragment>
		);
	}
}


const mapDispatchToProps = (dispatch) => ({
	getUserNotificationsViaWebsocket: bindActionCreators(AuthActions.getUserNotificationsViaWebsocket, dispatch),
	logOut: bindActionCreators(AuthActions.logOut, dispatch),
	markAsRead: bindActionCreators(AuthActions.markAsRead, dispatch)
})

const mapStateToProps = (state) => ({
	notifications: state.auth.notifications,
	is_authed: state.auth.is_authed,
	profile: state.auth.profile,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
