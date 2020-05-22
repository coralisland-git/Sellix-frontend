import React from 'react'
import {bindActionCreators} from 'redux'
import {LoaderFullscreen} from 'components';
import * as Actions from '../payments/actions'
import {connect} from 'react-redux'
import {AuthActions} from 'services/global'
import qs from 'query-string'


class StripeCallback extends React.Component {

  componentDidMount() {

    const { location, stripeAuthorize, getSelfUser} = this.props;
    const { code } = qs.parse(location.search)

    stripeAuthorize(code)
        .then(() => getSelfUser())
        .then(res => {
          const username = res.data.user.username;
          window.location = `/settings/${username}/payments`
        })
  }

  render() {
    return <LoaderFullscreen alwaysLoading={true}/>
  }
}


const mapDispatchToProps = (dispatch) => ({
  stripeAuthorize: bindActionCreators(Actions.stripeAuthorize, dispatch),
  getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
})

export default connect(null, mapDispatchToProps)(StripeCallback)