import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'
import { AuthActions, CommonActions } from 'services/global'
import layoutHOC from '../../HOC/layoutHOC'
import Header from './header'
import { LoaderFullscreen } from 'components'
import Body from './body'

import './style.scss'
import '../../layouts/landing/style.scss'


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

		document.title = `Products | Sellix`;

		if(window.$crisp && window.$crisp.on) {
			window.$crisp.do('chat:show')
		}

		this.initializeData()
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.props.match.params.username !== prevProps.match.params.username) {
			this.initializeData()
		}

		if(prevProps.user.username !== this.props.user.username) {
			const theme = this.props.user.shop_dark_mode === '1' ? 'dark' : 'light';
			document.body.classList.remove('light');
			document.body.classList.remove('dark');
			document.body.classList.add(theme);
		}
	}

	initializeData = () => {

		const { username } = this.props.match.params;
		const { getGeneralUserInfo, getSelfUser } = this.props;

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
				} else {
					if(window.$crisp && window.$crisp.on) {
						window.$crisp.do('chat:hide')
					}
				}
			})
			.catch((e) => {
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
	}

	verifiedTooltipToggle = () => {
		this.setState({verifiedTooltipOpen: !this.state.verifiedTooltipOpen})
	}

	render() {

		const { user, match, location } = this.props;
		const userId = match.params.username;
		const userIsLoading = Object.keys(user).length === 0;
		const dashboardUrl = user.username ? `/dashboard/${user.username}/home` : '/'

		return (
			<div>
				<LoaderFullscreen loaderRemovedInitially={!userIsLoading}/>
				<div className={'shop-container'}>
					<div className="app">
						<Header />

						<Body {...this.state} userId={userId} user={user} pathname={location.pathname} verifiedTooltipToggle={this.verifiedTooltipToggle} />

						<Footer {...this.state} dashboardUrl={dashboardUrl} />
					</div>
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
	getGeneralUserInfo: bindActionCreators(CommonActions.getGeneralUserInfo, dispatch)
})

export default layoutHOC(connect(mapStateToProps, mapDispatchToProps)(ShopLayout))
