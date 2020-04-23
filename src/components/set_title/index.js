import React, {Component} from 'react'
import {connect} from 'react-redux'

const mapStateToProps = ({auth: {profile}}) => ({
	notifications: profile ? profile.notifications.length || null : null
})

class SetTitle extends Component {

	componentDidUpdate(prevProps) {
		const { notifications, title } = this.props;

		if (prevProps.notifications !== notifications) {
			document.title = notifications ? `(${notifications}) Sellix - ${title}` : `Sellix - ${title}`;
		}
	}

	componentDidMount() {
	    const { notifications, title} = this.props;
		document.title = notifications ? `(${notifications}) Sellix - ${title}` : `Sellix - ${title}`;
	}

	render() {
		return <>{this.props.children}</>
	}
}

export default connect(mapStateToProps)(SetTitle)
