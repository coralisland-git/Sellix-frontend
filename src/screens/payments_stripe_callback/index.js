import React from 'react'
import {bindActionCreators} from 'redux'
import {LoaderFullscreen} from 'components';
import * as Actions from '../payments/actions'
import {connect} from 'react-redux'
import {AuthActions} from 'services/global'
import qs from 'query-string'


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
})

class StripeCallback extends React.Component {

  componentDidMount() {

    const { code } = qs.parse(this.props.location.search)

    this.props.actions.stripeAuthorize(code).then(() => {
      this.props.authActions.getSelfUser().then(res => {
        const username = res.data.user.username;

        window.location = `/settings/${username}/payments`
      })
    })
  }

  render() {
    return <LoaderFullscreen alwaysLoading={true}/>
  }
}

export default connect(null, mapDispatchToProps)(StripeCallback)