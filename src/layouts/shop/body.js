import React, { Component } from 'react'
import './style.scss'
import LockIcon from "../../assets/images/Lock.svg";
import {NotFound} from "../../components";
import verifiedIcon from "../../assets/images/sellix_verified.svg";
import {Card, Container, Nav, NavItem, Tooltip} from "../../components/reactstrap";
import NavLink from 'react-router-dom/es/NavLink'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import GoogleAnalytics from "./googleAnalytics";
import {shopRoutes} from "../../routes";


class Footer extends Component {

  render() {

    const { userId, userIsNotFound, userIsBanned, user, verifiedTooltipOpen, verifiedTooltipToggle, pathname } = this.props;

      if(userIsBanned) {
          return <div className={"text-center"} style={{ margin: '100px' }}>
              <img src={LockIcon} width="150" alt={"Sellix"} />
              <h1 className="text-primary" style={{ marginTop: '50px' }}>User has been banned</h1>
          </div>
      } else if(userIsNotFound) {
          return <div>
              <NotFound/>
          </div>
      }

      return <div className="shop-content flex-column">
          <section className="pb-3">
              <div className="text-center align-items-center logo-content">
                  <h4 className="mb-0 mt-3 mb-2">
                      <span style={{fontSize: 20}}>{user.username}&nbsp;</span>
                      {user.verified == '1' &&
                      <span style={{ fontSize: 17 }}>
									<img src={verifiedIcon} width="20" className="verified-icon mb-1" id="verifiedTooltip" />
									<Tooltip
                                        placement="right"
                                        isOpen={verifiedTooltipOpen}
                                        target="verifiedTooltip"
                                        toggle={verifiedTooltipToggle}>
										This shop has verified its brand identity to Sellix.
									</Tooltip>
								</span>
                      }
                  </h4>

                  {user.profile_attachment ?
                      <img src={user.profile_attachment} width="130" height="130" style={{ borderRadius: '50%' }} alt={""}/> :
                      <i className={"fas fa-user-circle justify-content-center align-items-center d-inline-flex"} style={{width: 130, height: 130, fontSize: "8.3rem", color: "#603bea", borderRadius: "100%"}}/>
                  }
              </div>
              <Card className="report-count mb-3 mt-3 ml-auto mr-auto pt-1 pb-1 pl-3 pr-3 flex-row" style={{ width: 'fit-content' }}>
						<span className="text-green mr-2">
							{user.feedback ? user.feedback.positive : 0}
						</span>
                  <span className="" />
                  <span className="neutral-count pl-2 pr-2">
							{user.feedback ? user.feedback.neutral : 0}
						</span>
                  <span className="" />
                  <span className="text-red ml-2">
							{user.feedback ? user.feedback.negative : 0}
						</span>
              </Card>
              <div className="shop-navs">
                  <Nav className="d-flex flex-row justify-content-center">
                      <NavItem className="px-1" active={pathname == `/${userId}` || pathname.includes(`/${userId}/category`)}>
                          <NavLink to={`/${userId}`} className="nav-link">
                              Products
                          </NavLink>
                      </NavItem>
                      <NavItem className="px-1" active={pathname == `/${userId}/contact` || pathname.includes(`/${userId}/query`)}>
                          <NavLink to={`/${userId}/contact`} className="nav-link">
                              Contact
                          </NavLink>
                      </NavItem>
                      <NavItem className="px-1" active={pathname == `/${userId}/feedback`}>
                          <NavLink to={`/${userId}/feedback`} className="nav-link">
                              Feedback
                          </NavLink>
                      </NavItem>
                  </Nav>
              </div>
          </section>

          <div className="shop-section">
              <div className="shop-main p-3">
                  <Container className="p-0" fluid>
                      <GoogleAnalytics tracking_id={user.shop_google_analytics_tracking_id}>
                          <Switch>
                              {shopRoutes.map((props, key) => <Route {...props} key={key} />)}
                          </Switch>
                      </GoogleAnalytics>
                  </Container>
              </div>
          </div>
      </div>
  }
}

export default Footer