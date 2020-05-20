import React from 'react'
import { NavbarBrand, Nav, Navbar, Collapse} from 'components/reactstrap'
import { Link } from "react-scroll";
import { Button } from "components";

import sellix_logo_footer from 'assets/images/Sellix_logo.svg'
import sellix_logo from "assets/images/Sellix_logo_white.svg";


export function LandingHeader({ page, isOpen, user, history, dashboardUrl }) {
    return <header className={`pt-2 pb-2 ${page === '/' ? 'home-header' : ''}`}>
        <Navbar  color="white" light expand="lg">
            <NavbarBrand href="/">
                <img className="logo" src={page === '/'?sellix_logo:sellix_logo_footer} alt={"Sellix"}/>
            </NavbarBrand>

            {page === '/' &&
                <Collapse className="mr-5" isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <Link activeClass="active" to="home_section" spy={true} smooth={true} offset={-70} duration= {500}>Home</Link>
                        <Link activeClass="active" to="feature_section" spy={true} smooth={true} offset={-70} duration= {500}>Features</Link>
                        <Link activeClass="active" to="started_section" spy={true} smooth={true} offset={-70} duration= {500}>Get Started</Link>
                    </Nav>
                </Collapse>
            }

            <div>
                { user && <Button className="mr-3 landing-primary-button text-white menu" onClick={() => history.push(dashboardUrl)}>Dashboard</Button>}
                { !user && <Button className="landing-secondary-button menu mr-2" onClick={() => history.push('/auth/login')}>Log In</Button>}
                { !user && <Button className="landing-primary-button menu" onClick={() => history.push('/auth/register')}>Sign Up</Button>}
            </div>
        </Navbar>
    </header>
}

export default LandingHeader
