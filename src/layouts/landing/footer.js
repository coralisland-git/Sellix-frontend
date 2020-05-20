import React from 'react'

import { Container, NavbarBrand, Nav, NavItem, NavLink } from 'components/reactstrap'
import sellix_logo_footer from 'assets/images/Sellix_logo.svg'

const LandingFooter = ({ dashboardUrl }) =>
    <footer>
        <div className="footer-hr"/>
        <div className="section white text-center" style={{paddingBottom: 100, paddingTop: 50}}>
            <Container className="home-container p-0" fluid>
                <div className="d-flex justify-content-between text-left flex-wrap">
                    <div className="mb-3">
                        <NavbarBrand className="p-0" href="/">
                            <img className="logo" src={sellix_logo_footer} width="137" alt={"Sellix"}/>
                        </NavbarBrand>
                        <p className="mt-2">Copyright © 2020, Sellix.io.</p>
                    </div>
                    <div className="mb-3" style={{maxWidth: 295}}>
                    <h5 className="mb-3">About Us</h5>
                    <p className="mt-4">Sellix is an online e-commerce payment processing
                    website that lets you create your own store with a couple of clicks.</p>
                </div>
                    <div className="mb-3">
                        <h5 className="mb-3">Sellix</h5>
                        <Nav vertical>
                        <NavItem>
                            <NavLink href={dashboardUrl}>Dashboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/auth/register">Register</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/terms">Terms</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/changelog">Changelog</NavLink>
                        </NavItem>
                        </Nav>
                    </div>
                    <div className="mb-3">
                        <h5 className="mb-3">Products</h5>
                        <Nav vertical>
                        <NavItem>
                            <NavLink href="/documentation">API</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Payments</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/fees">Fees</NavLink>
                        </NavItem>
                        </Nav>
                    </div>
                    <div className="mb-3">
                        <h5 className="mb-3">Help</h5>
                        <Nav vertical>
                        <NavItem>
                            <NavLink href="#">Help Center</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/contact">Contact Us</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://t.me/sellixio">Telegram</NavLink>
                        </NavItem>

                        </Nav>
                    </div>
                </div>
            </Container>
        </div>
    </footer>


export default LandingFooter
