import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  UncontrolledDropdown
} from 'reactstrap'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { AuthActions } from 'services/global'

import './style.scss'



import sellix_logo from 'assets/images/Sellix_logo.svg'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

const userId = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    authActions: bindActionCreators(AuthActions, dispatch)
  })
}

class Header extends Component {

  signOut = () => {
    this.props.authActions.logOut()
    this.props.history.push('/auth/login')
  }

  render() {
    const { user, profile, children, is_authed, history, ...attributes } = this.props

    return (
      <React.Fragment>
        <a href="/" className="logo"><img src={sellix_logo} alt='Sellix Logo'/></a>
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
                  <DropdownMenu right className="mt-4">
                    {
                      profile && profile.rank !== "0" && <DropdownItem onClick={() => history.push(`/admin/dashboard`)}>
                        <i className={"fa fa-circle-o fa-md"} /> Admin Panel
                      </DropdownItem>
                    }
                    <DropdownItem onClick={() => this.props.history.push(`/dashboard/${userId}`)}>
                      <i className={"fa fa-circle-o fa-md"} /> Dashboard
                    </DropdownItem>
                    <DropdownItem className={'active'} onClick={() => this.props.history.push(`/${userId}`)}>
                      <i className={"fa fa-dot-circle-o fa-md"} /> Your Shop
                    </DropdownItem>
                    <DropdownItem onClick={() => this.props.history.push(`/settings/${userId}`)}>
                      <i className={"fa fa-circle-o fa-md"} /> Settings
                    </DropdownItem>
                    
                    <DropdownItem onClick={() => this.signOut()}>
                      <i className={"fa fa-circle-o fa-md"} /> Sign Out
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
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(Header)
