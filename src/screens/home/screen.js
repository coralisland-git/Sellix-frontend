import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Button,
  Col,
  Container,
  Row,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import {
  AppHeader
} from '@coreui/react'

import './style.scss'

import {
  Loading
} from 'components'

import top1 from 'assets/images/home/phone_vector2x.png'
import service1 from 'assets/images/home/service1.svg'
import service2 from 'assets/images/home/service2.svg'
import service3 from 'assets/images/home/service3.svg'
import undraw from 'assets/images/home/left-part-iso@2x.png'
import undraw1 from 'assets/images/home/right-side-iso@2x.png'
import sellix_logo from 'assets/images/Sellix_logo.svg'
import background1 from 'assets/images/home/BG@2x.png'
import background2 from 'assets/images/home/Bg2@2x.png'

class Home extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    const { isOpen } = this.state

    return (
      <div className="home-screen">
        <img className="background1-img" src={background1}/>
        <div className="section white" style={{paddingTop: 0, paddingBottom: 50}}>
            <Container className="home-container p-0" fluid>
              <Row className="flex-row">
                <Col md={7} className="mb-5" style={{paddingTop: '10%'}}>
                  <h1 className="text-white">Digital Selling With Ease</h1>
                  <p className="large pr-3 text-white col-8 p-0">
                    You provide the products on Sellix, we take care of the rest. Day and night.
                  </p>
                  <Button className="landing-primary-button f-20 f-b"><NavLink className="p-0 text-white" href="/auth/register">Get Started for Free</NavLink></Button>
                </Col>
                <Col md={5}>
                  <img src={top1} className="digital-img"/>
                </Col>
              </Row>
            </Container>
          </div>
        <div className="section pt-0 pb-5 text-center bg-white">
          <Container className="home-container" fluid>
            <h1 className="text-pink">Start selling with Sellix</h1>
            <p className="large text-darkgrey">
              Put the ability to create a full customizable online storefront right at your fingertips
            </p>
            <Row className="mt-5 pt-4">
              <Col md={4} className="p-2">
                <div className="service-card zindex-3">
                  <img className="service-img" src={service1}/>
                  <h4 className="mt-4 text-pink f-20 f-b">Customizable Shop</h4>
                  <p className="small text-pink">
                  Our platforms offers coupons, blacklist, tickets, automated delivery, webhooks and many more features that you can fully customize for your needs.
                  </p>
                </div>
              </Col>
              <Col md={4} className="p-2">
                <div className="service-card service-card-shadow zindex-2">
                  <img className="service-img" src={service2}/>
                  <h4 className="mt-4 text-pink f-20 f-b">Payment Flexibility</h4>
                  <p className="small text-pink">
                  Looking for a specific type of payment option? Don't look further. We provide PayPal, Stripe, PerfectMoney and every popular cryptocurrencie for your store.
                  </p>
                  <p className="text-pink f-b mt-5"><Link to="/fees" className="text-pink">Fees →</Link></p>
                </div>
              </Col>
              <Col md={4} className="p-2">
                <div className="service-card service-card-shadow">
                  <img className="service-img" src={service3}/>
                  <h4 className="mt-4 text-pink f-20 f-b">All-in-One Platform</h4>
                  <p className="small text-pink">
                  With Sellix you got everything in one platform. Statistics about your online store and features make sure you know everything about your orders.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <img className="background2-img" src={background2}/>
        <div className="section white" style={{paddingBottom: 100, paddingTop: 150}}>
          <Container className="p-0" fluid>
            <Row className="flex-row align-items-center">
              <Col md={5} className="mb-3">
                <div className="float-right" style={{maxWidth: 450}}>
                  <h1 className="text-pink">Reliable Payment Processing</h1>
                  <p className="text-pink f-20">
                  Sellix uses the newest payment processing technologies to ensure your payment gets processed with the lowest cost of transaction fees at any time.
                  </p>
                </div>
                
              </Col>
              <Col md={7} className="text-right" style={{position: 'relative'}}>
                <img className="undraw-img" src={undraw}/>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="section white pt-5 payment-fee">
          <Container className="p-0" fluid style={{maxWidth: 1330}}>
            <Row className="flex-row align-items-center">
              <Col md={7}>
                <img className="pc-img" src={undraw1}/>
              </Col>
              <Col md={5}>
                <div className="float-left pb-5" style={{maxWidth: 447}}>
                  <h1 className="text-pink">Cheap Payment Fees</h1>
                  <p className="text-pink f-20 col-11 p-0">
                  We provide very low fees for each transaction. With our unique payment processing method, we keep transaction fees at the lowest amount. Find out more about our fees.
                  </p>
                  <Button className="landing-primary-button"><NavLink className="p-0 text-white" href="/fees">Our  Fees →</NavLink></Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="section white text-center" style={{paddingBottom: 125}}>
          <Container className="mr-auto ml-auto p-0 purple" fluid style={{maxWidth: 1330}}>
            <h1 className="mb-4">Start using <b>Sellix</b> now!</h1>
            <p className="mr-auto ml-auto">Create an account and start selling your products. Are you ready? Because we are.</p>
            <Button className="landing-secondary-button"><NavLink className="p-0" href="/auth/register">Get Started →</NavLink></Button>
          </Container>
        </div>
      </div>
    )
  }
}

export default Home
