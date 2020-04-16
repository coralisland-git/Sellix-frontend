import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown,
  Input,
  Badge
} from 'reactstrap'
import PropTypes from 'prop-types'

import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler
} from '@coreui/react'

import './style.scss'



import sellix_logo from 'assets/images/Sellix_logo.svg'
import avatar from 'assets/images/avatars/6.png'
import chevron from 'assets/images/chevron-down-solid.png'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

const userId = window.localStorage.getItem('userId')

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }

    this.signOut = this.signOut.bind(this)
  }

  signOut () {
    this.props.authActions.logOut()
    this.props.history.push('/auth/login')
  }

  setTheme(){
    this.props.changeTheme()
  }

  render() {
    const { user, profile, children, theme, is_authed, ...attributes } = this.props
    
    console.log(this.props)
    return (
      <React.Fragment>
        <a href="/" className="logo"><img src={sellix_logo} alt='CoreUI Logo'/></a>
        <Nav className="ml-auto shop-header" navbar style={{flex:1, justifyContent: 'flex-end'}}>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle className="user-name" nav>
              <div>
                {profile && profile.profile_attachment?
                  <img src={profile.profile_attachment} className="mt-2" width="45" height="45" style={{borderRadius: '50%'}}/>:
                  <i className="fa fa-user-circle text-primary avatar-icon"/>
                }
              </div>
            </DropdownToggle>
            {
              is_authed?
                <DropdownMenu right className="mt-2">
                  <DropdownItem onClick={() => this.props.history.push(`/dashboard/${userId}`)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={this.setTheme.bind(this)}>
                    {(theme || 'light') === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </DropdownItem>
                  <DropdownItem onClick={() => this.signOut()}>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
                :
                <DropdownMenu right className="mt-2">
                  <DropdownItem onClick={this.setTheme.bind(this)}>
                    {(theme || 'light') === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </DropdownItem>
                  <DropdownItem onClick={() => this.props.history.push(`/auth/login`)}>
                    Log In
                  </DropdownItem>
                </DropdownMenu>
            }
            
          </UncontrolledDropdown>
          
        </Nav>
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default Header
