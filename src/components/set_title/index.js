import React, {Component} from 'react'
import {connect} from 'react-redux'

const mapStateToProps = ({auth: {profile}}) => ({
	notifications: profile ? profile.notifications.length || null : null
})

class SetTitle extends Component {

	componentDidUpdate(prevProps) {
		const { notifications, title } = this.props;

		if (prevProps.notifications !== notifications) {
			document.title = notifications ? `(${notifications}) ${title} | Sellix` : `${title} | Sellix`;
		}
	}

	componentDidMount() {
	    const { notifications, title} = this.props;
	    if(title === 'Home') {
		    document.title = 'Sellix: Digital Selling with Ease'
	    }
		document.title = notifications ? `(${notifications}) ${title} | Sellix` : `${title} | Sellix`;
	}

	render() {
		return <>{this.props.children}</>
	}
}

export default connect(mapStateToProps)(SetTitle)
