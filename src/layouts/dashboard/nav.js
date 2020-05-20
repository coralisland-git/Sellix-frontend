import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as router from 'react-router-dom';
import { BrowserView, MobileView } from "react-device-detect";
import AppSidebarNav from '@coreui/react/es/SidebarNav2'
import AppSidebar from '@coreui/react/es/Sidebar'
import { mainBrowserNavigation, mainMobileNavigation, adminNavigation } from 'constants/navigation'

import './style.scss'


const Nav = ({ location }) => {
  return <AppSidebar className="pt-3 mb-5" fixed display="lg">
    <Switch>
      <Route path="/admin">
        <AppSidebarNav navConfig={adminNavigation} location={location} router={router} />
      </Route>
      <Route>
        <BrowserView>
          <AppSidebarNav navConfig={mainBrowserNavigation()} location={location} router={router} />
        </BrowserView>
        <MobileView>
          <AppSidebarNav navConfig={mainMobileNavigation()} location={location} router={router} />
        </MobileView>
      </Route>
    </Switch>
  </AppSidebar>
}

export default Nav
