import React, { Component } from 'react'
import './style.scss'
import LandingFooter from "../landing/footer";
import AppFooter from "@coreui/react/lib/Footer";


class Footer extends Component {

  render() {
    const { userIsNotFound, userIsBanned, dashboardUrl } = this.props;

    return userIsNotFound ? <div className="landing-layout"><LandingFooter dashboardUrl={dashboardUrl} /></div> :
        <AppFooter style={userIsBanned ? { position: 'fixed', bottom: 0, width: '100%' } : {}}>
          <p className="text-center text-grey footer-report py-4 m-0">
            Copyright by Sellix.io -{' '}<a href="mailto:abuse@sellix.io">Report Abuse</a>
          </p>
        </AppFooter>
  }
}

export default Footer
