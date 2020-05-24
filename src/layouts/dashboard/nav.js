import React from 'react'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import * as router from 'react-router-dom';
import { BrowserView, MobileView } from "react-device-detect";
import AppSidebarNav from '@coreui/react/es/SidebarNav2'
import AppSidebar from '@coreui/react/es/Sidebar'
import { mainBrowserNavigation, mainMobileNavigation } from 'constants/navigation'

import './style.scss'


export const Nav = ({ location, nav }) => {
  return <AppSidebar className="pt-3 mb-5" fixed display="lg">
    <Switch>
      <Route path="/admin">
        <AppSidebarNav navConfig={nav} location={location} router={router} />
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
