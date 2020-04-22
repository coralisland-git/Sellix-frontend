import React from "react";
import {
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Col,  
  Row,
  Collapse,  
} from "reactstrap";
import { Link } from "react-router-dom";
import sellix_logo from "assets/images/Sellix_logo.svg";

import "./style.scss";

const NAVITATIONS = [
  { key: 'introduction', value: 'Introduction' },
  { key: 'authentication', value: 'Authentication' },
  { key: 'pagenation', value: 'Pagenation' },
  { key: 'errors', value: 'Errors' },
  { key: 'webhooks', value: 'Webhooks' }  
]

class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div className="documentation-screen">
        <Row className="d-wrapper">
          <Col lg={3} className="d-nav">
            <Card>
              <CardBody>
                <ul className="section-nav">
                  {
                    NAVITATIONS.map((nav, index) => {
                      return (
                        <li key={index}>{nav.value}
                        </li>
                      )
                    })
                  }
                </ul>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <div className="animated fadeIn">
              <Card>
                <CardBody>
                  <Row>
                    <Col lg={10}>
                      <section id="introduction">
                        <h3><b>Introduction</b></h3>
                        <p>
                          Welcome to the Selly REST API. You can use our API to access Selly API endpoints to build your own systems on top of our platform. <br /> <br />
                          We have official API libraries in multiple languages. You can view code examples to the right, and you can switch the 
                        </p>
                        <div className="code-block">
                          <div className="code-block-header">
                            ROOT URL
                          </div>
                          <div className="code-block-body">
                            https://selly.io/api/v2
                          </div>
                        </div>
                      </section>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Col>
          <Col lg={3}>
            <Card>
              <CardBody>
                <ul className="action-list">
                  <li>Blacklist object</li>
                  <li>Get a Blacklist</li>
                  <li>List all Blacklist</li>
                  <li>Create a Blacklist</li>
                  <li>Update a Blacklist</li>
                  <li>Destroy Blacklist</li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>        
      </div>
    );
  }
}

export default Documentation;
