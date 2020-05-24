import React, {Component} from "react";
import {toast, ToastContainer} from "react-toastify";
import {bindActionCreators} from "redux";
import {AuthActions, CommonActions} from "../services/global";
import withRouter from 'react-router-dom/es/withRouter'
import {connect} from "react-redux";

export default function layoutHOC(props) {
	class InitComponent extends Component {

		constructor(props) {
			super(props);
			this.theme = window.localStorage.getItem('theme') || 'light';

			document.body.classList.remove('light');
			document.body.classList.remove('dark');
			document.body.classList.add(this.theme);
		}

		componentDidMount() {
			this.props.setTostifyAlertFunc((status, message) => {
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

			let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

			if (iOS) {
				for (let i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
					let element = document.getElementsByClassName('nav-link')[i];
					element.addEventListener("mouseenter", function (event) {
						element.click();
					}, false);
				}
			}
		}

		changeTheme = () => {
			this.theme = window.localStorage.getItem('theme') || 'light';
			window.localStorage.setItem('theme', this.theme === 'light' ? 'dark' : 'light')

			document.body.classList.remove('light');
			document.body.classList.remove('dark');
			document.body.classList.add(this.theme === 'light' ? 'dark' : 'light');
		}


		render() {

			let Component = props;

			return <>
				<Component {...this.props} changeTheme={this.changeTheme} theme={this.theme} />
				<ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 1999 }} hideProgressBar={true} />
			</>;
		}
	}

	const mapStateToProps = (state) => ({
		is_authed: state.auth.is_authed
	})
	const mapDispatchToProps = (dispatch) => ({
		authActions: bindActionCreators(AuthActions, dispatch),
		setTostifyAlertFunc: bindActionCreators(CommonActions.setTostifyAlertFunc, dispatch)
	})

	return withRouter(connect(mapStateToProps, mapDispatchToProps)(InitComponent))
}
