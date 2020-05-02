import React, { Component } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, UncontrolledDropdown, Input, Badge } from 'reactstrap'
import ReactTimeAgo from 'react-time-ago'
import IntervalTimer from 'react-interval-timer';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'

import sellix_logo from 'assets/images/Sellix_logo_beta.svg'
import './style.scss'


const userId = window.localStorage.getItem('userId')


class Header extends Component {

  signOut = () => {
    this.props.authActions.logOut()
    this.props.history.push('/')
  }

  setTheme = () => {
    this.props.changeTheme()
  }

  markAsRead = () => {
    this.props.authActions.markAsRead()
  }

  render() {
    const { profile, children, theme, is_authed, isShop, history, isDocumentation, ...attributes } = this.props
    const { notifications } = profile || {};
    const path = this.props.history.location.pathname
    
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          className={`p-2 ${isShop?'':'border-right'}`}
          href="/"
          full={{ src: sellix_logo, width: 106, height: 25, alt: 'CoreUI Logo' }}
        />
        { !isDocumentation && (
          <Nav className="ml-auto" navbar style={{flex:1, justifyContent: 'flex-end'}}>
            {
              !isShop && 
                <NavItem className="d-md-down-none mr-5" style={{flex: 3}}>
                  <div className="searchbar">
                    <i className="fas fa-search"/>
                    <Input placeholder="Search..." className="header-search-input" />
                  </div>
              </NavItem>
            }

            {
              !isShop && 
                <UncontrolledDropdown nav direction="down" className="ml-3 mr-2">
                  <i className={`fas fa-moon-o nav-icon moon-icon ${(theme || 'light') === 'light' ? 'dark-theme' : 'light-theme'}`} onClick={this.setTheme.bind(this)}/>
                </UncontrolledDropdown>
            } 
            
            <UncontrolledDropdown nav direction="down" className="d-sm-down-none ml-3 mr-3">
              <DropdownToggle className="user-name" nav>
                <i className="fa icon-question nav-icon" style={{fontSize: 22, fontWeight: 'bold', marginTop: 2}} />
              </DropdownToggle>
              
              <DropdownMenu right className="mt-2">
                <DropdownItem onClick={() => history.push('/admin')}>
                   Help Center
                </DropdownItem>
                <DropdownItem onClick={() => history.push('/contact')}>
                   Contact Us
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav direction="down" className="d-sm-down-none mr-3">
              <DropdownToggle className="user-name" nav>
                <i className="fas fa-bell nav-icon" />
                {notifications && notifications.length > 0 &&  
                  <sup>
                    <Badge color="danger" style={{ color: 'white', padding: '6px', height: '19px'}}>
                      {notifications.length}
                    </Badge>
                  </sup>
                }
              </DropdownToggle>

              <IntervalTimer
                timeout={3000}
                callback={this.props.authActions.getSelfUserViaWebsocket}
                enabled={true}
                repeat={true}
              />
              
              <DropdownMenu right className="mt-2" style={{width: 300, maxHeight: 300, overflow: 'auto'}}>
                <DropdownItem>
                  <div className="d-flex justify-content-between">
                    <span className="text-primary d-flex">Notification</span>
                    {
                      (notifications && notifications.length > 0) && 
                        <span className="d-flex text-grey" onClick={this.markAsRead.bind(this)}>Mark as Read</span>
                    }
                  </div>
                </DropdownItem>
                
                  {notifications && notifications.length > 0? 
                    notifications.map((notify, key) =>
                      <DropdownItem key={key}>
                        <div className="notification-row">
                          <div className="d-flex justify-content-between align-items-end">
                            <p className="title mb-0">{notify.title}</p>
                            <span className="timeago">
                              <ReactTimeAgo date={notify.created_at*1000/1} locale="en"/></span>
                          </div>
                          <p className="message mb-0 text-grey">{notify.message}</p>
                        </div>
                      </DropdownItem>
                    )
                    :
                    <DropdownItem >
                      <p className="text-grey text-center pt-3">You have no notification.</p>
                    </DropdownItem>
                  }
                
                
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav direction="down">
              <DropdownToggle className="user-name" nav>
                <div>
                  {profile && profile.profile_attachment?
                    <img src={profile.profile_attachment} width="35" height="35" style={{borderRadius: '50%'}} />:
                    <i className="fa fa-user-circle text-primary avatar-icon" />
                  }
                </div>
              </DropdownToggle>
              {
                is_authed? 
                  <DropdownMenu right className="mt-2">
                    {
                      profile && profile.rank !== "0" && 
                      <DropdownItem className={path.startsWith('/admin')?'active':''} onClick={() => history.push(`/admin/dashboard`)}>
                        <i className={path.startsWith('/admin')?"fa fa-dot-circle-o fa-md":"fa fa-circle-o fa-md"} /> Admin Panel
                      </DropdownItem>
                    }
                    <DropdownItem className={path.startsWith('/dashboard')?'active':''} onClick={() => this.props.history.push(`/dashboard/${userId}`)}>
                      <i className={path.startsWith('/dashboard')?"fa fa-dot-circle-o fa-md":"fa fa-circle-o fa-md"} /> Dashboard
                    </DropdownItem>
                    <DropdownItem className={isShop?'active':''} onClick={() => this.props.history.push(`/${userId}`)}>
                      <i className={isShop?"fa fa-dot-circle-o fa-md":"fa fa-circle-o fa-md"} /> Your Shop

                    </DropdownItem>
                    <DropdownItem className={path.startsWith('/settings')?'active':''} onClick={() => this.props.history.push(`/settings/${userId}`)}>
                      <i className={path.startsWith('/settings')?"fa fa-dot-circle-o fa-md":"fa fa-circle-o fa-md"} /> Settings
                    </DropdownItem>
                    
                    <DropdownItem onClick={() => this.signOut()}>
                      <i className={path.startsWith('/signin')?"fa fa-dot-circle-o fa-md":"fa fa-circle-o fa-md"} /> Sign Out
                    </DropdownItem>
                  </DropdownMenu>:
                  <DropdownMenu right className="mt-2">
                    <DropdownItem onClick={() => history.push(`/auth/login`)}>
                      Log In
                    </DropdownItem>
                  </DropdownMenu>
              }
              
            </UncontrolledDropdown>
            
          </Nav>
        )}
      </React.Fragment>
    );
  }
}

export default Header
