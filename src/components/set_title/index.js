import React, {Component} from 'react'
import {connect} from 'react-redux'

const mapStateToProps = ({ auth: { notifications } }) => ({
	notifications: notifications.length ? notifications : null
})

class SetTitle extends Component {

	componentDidUpdate(prevProps) {
		const { notifications, title } = this.props;

		if (prevProps.notifications !== notifications) {
			document.title = notifications ? `(${notifications.length}) ${title} | Sellix` : `${title} | Sellix`;
		}
	}

	componentDidMount() {
	    const { notifications, title} = this.props;
	    if(title === 'Home') {
		    document.title = 'Sellix: Digital Selling with Ease'
	    }
		document.title = notifications ? `(${notifications.length}) ${title} | Sellix` : `${title} | Sellix`;
	}

	render() {
		return <>{this.props.children}</>
	}
}

export default connect(mapStateToProps)(SetTitle)
