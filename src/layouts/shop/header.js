import React, { Component } from 'react'
import {connect} from 'react-redux'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown } from 'components/reactstrap'
import { bindActionCreators } from 'redux'
import { AuthActions } from 'services/global'
import AppHeader from "@coreui/react/lib/Header"
import withRouter from "react-router-dom/withRouter"

import sellix_logo from 'assets/images/Sellix_logo.svg'

import './style.scss'



const userId = window.localStorage.getItem('userId')

class Header extends Component {

  signOut = () => {
    this.props.logOut()
    this.props.history.push('/auth/login')
  }

  render() {
    const { profile, is_authed, history } = this.props;

    return (
        <AppHeader>
          <a href="/" className="logo"><img src={sellix_logo} alt='Sellix Logo'/></a>
          <Nav className="ml-auto shop-header justify-content-end" navbar style={{ flex: 1 }}>
            <UncontrolledDropdown nav direction="down">
              <DropdownToggle className="user-name" nav>
                <div>
                  {profile && profile.profile_attachment?
                    <img src={profile.profile_attachment} className="mt-2" width="45" height="45" style={{borderRadius: '50%'}} alt={"Logo"}/>:
                    <i className="fas fa-user-circle text-primary avatar-icon"/>
                  }
                </div>
              </DropdownToggle>
              {
                is_authed?
                  <DropdownMenu right className="mt-4">
                    {
                      profile && profile.rank !== "0" && <DropdownItem onClick={() => history.push(`/admin/dashboard`)}>
                        <i className={"fas fa-users-cog"} /> Admin Panel
                      </DropdownItem>
                    }
                  <DropdownItem onClick={() => this.props.history.push(`/dashboard/${userId}`)}>
                    <i className={"nav-icon fas fa-home"} /> Dashboard
                  </DropdownItem>
                  <DropdownItem className={'active'} onClick={() => this.props.history.push(`/${userId}`)}>
                    <i className={"nav-icon fas fa-shopping-basket"} /> Your Shop
                  </DropdownItem>
                  <DropdownItem onClick={() => this.props.history.push(`/settings/${userId}`)}>
                    <i className={"nav-icon fas fa-cog"} /> Settings
                  </DropdownItem>
                  
                  <DropdownItem onClick={() => this.signOut()}>
                    <i className={"fa fa-sign-out-alt"} /> Sign Out
                  </DropdownItem>
                </DropdownMenu>:
                <DropdownMenu right className="mt-2">
                  <DropdownItem onClick={() => this.props.history.push(`/auth/login`)}>
                    Log In
                  </DropdownItem>
                </DropdownMenu>
              }
            
          </UncontrolledDropdown>
          
        </Nav>
      </AppHeader>
    );
  }
}



const mapStateToProps = (state) => ({
  is_authed: state.auth.is_authed,
  profile: state.auth.profile
})

const mapDispatchToProps = (dispatch) => ({
  logOut: bindActionCreators(AuthActions.logOut, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
