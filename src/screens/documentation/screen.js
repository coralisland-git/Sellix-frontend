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

    const { history } = this.props;
    var key = history.location.hash.substr(1);
    if (key === "")
      key = "introduction";

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
                        <li key={index}>
                          <a 
                            href={`/documentation#${nav.key}`} 
                            className={ key === nav.key && "active"}
                          >{nav.value}</a>
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
                          Welcome to the Sellix REST API. You can use our API to access Sellix API endpoints to build
                          your own systems on top of our platform. <br /><br />
                          We have official API libraries in multiple languages. You can view code examples to the right, 
                          and you can switch the programming language of the examples with the language selector at the
                          top or any code block.
                        </p>
                        <div className="code-block">
                          <div className="code-block-header">
                            ROOT URL
                          </div>
                          <div className="code-block-body">
                            https://sellix.io/api/v2
                          </div>
                        </div>
                      </section>
                      <section id="authentication">
                        <h3><b>Authentication</b></h3>
                        <p>
                          Sellix's API uses <a href="#">Basic authentication</a> with your account email and API key. This is usually done
                          via the <span class="badge-mark">Authorization</span> header <br /><br />
                          Your API key can be accessed and re-generated <a href="#">here</a><br /><br />
                          All API requests must be made over HTTPS.
                        </p>
                        <div className="code-block">
                          <div className="code-block-header">
                            SETUP AUTHENTICATION
                          </div>
                          <div className="code-block-body">
                            require 'sellix' <br /><br />
                            sellix.api_key = 'api key'<br />
                            sellix.api_email = 'email'
                          </div>
                        </div>
                      </section>
                      <section id="pagenation">
                        <h3><b>Pagenation</b></h3>
                        <p>
                          Selly offers the ability to paginate any list endpoint. The <span class="badge-mark">X-Total-Pages</span> header returns 
                          the total number of pages for the resources at the specific endpoint you're using. <br/><br/>

                          By default, <span class="badge-mark">20</span> resources are displayed per page.
                        </p>
                        <p className="param"><b>Parameters</b></p>
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <p className="param">page</p>
                                <p>integer</p>
                              </td>
                              <td>
                                The page number. Default to 1
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="param">per_page</p>
                                <p>integer</p>
                              </td>
                              <td>
                                Records per page. Defaults to 20. Allowed values are  10 and 50
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="code-block">
                          <div className="code-block-header">
                            PAGINATING ORDERS EXAMPLE
                          </div>
                          <div className="code-block-body">
                            # Page 10 <br />
                            Selly::Orders::List(page: 10) <br /><br />
                            # Page 10 and 50 per page <br />
                            Selly::Orders::List(page: 10, per_page: 50)
                          </div>
                        </div>
                      </section>
                      <section id="errors">
                        <h3><b>Errors</b></h3>
                        <p>
                          Errors will only ever be present with a <span class="badge-mark">400</span> to <span class="badge-mark">503</span> HTTP response 
                          status. All errors will include a <span class="badge-mark">message</span> attribute detailing the error message. <br /><br />
                          Validation errors will feature a <span class="badge-mark">errors</span> attribute containing an array of error message strings. <br /><br />
                          The Selly API uses the following error codes:
                        </p>
                        <div className="code-block">
                          <div className="code-block-header">
                            Authentication Error
                          </div>
                          <div className="code-block-body">
                            
                          </div>
                        </div>
                      </section>
                      <section id="webhooks">
                        <h3><b>Webhook</b></h3>
                        <p>
                          Selly provides a webhooks system allowing you to subscribe to to events with <a href="#">Webhook Endpoints</a>, 
                          alongside Product/Payment Order status webhooks and Dynamic Product webhooks. <br /><br />

                          Please note <b>only HTTPS webhook URLs are supported</b>.<br /><br />

                          A webhook simulator is available allowing you to simulate webhooks to a URL. It can be accessed <a href="#">here</a>.<br /><br />
                        </p>
                        <p className="param"><b>Signing/Validating</b></p>
                        <p>
                          To verify the authenticity of a webhook request and its payload, each webhook request includes 
                          a <span class="badge-mark">X-Sellix-Signature</span> header with a 
                          HMAC signature comprised of the JSON encoded request body and your webhook secret. 
                          Your webhook secret can be changed in your <a href="#">settings page</a>. <br /><br />
                        </p>
                        <p className="param"><b>Events</b></p>
                        <p>
                          Each webhook request will feature a <span class="badge-mark">X-Sellix-Event</span> header containing the 
                          webhook event type. A list of supported events from <a href="#">Webhook Endpoints</a> can be found below.
                        </p>
                        <p className="param"><b>Logs</b></p>
                        <p>
                          Each webhook request will create a <a href="#">Webhook Log</a>. The object is created by the request 
                          has been sent. Before the request response has actually been received, the <span class="badge-mark">response_code</span> will 
                          be <span class="badge-mark">0</span>, indicating it is pending.<br /><br />
                          Each webhook request will also include a <span class="badge-mark">X-Sellix-Webhook</span> request header 
                          containing the <a href="#">Webhook Log</a> <span class="badge-mark">id</span>.
                        </p>

                        <div className="code-block">
                          <div className="code-block-header">
                            VALIDATING SIGNED WEBHOOK SIGNATURE
                          </div>
                          <div className="code-block-body">
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
                  <li><a href="/documentation#">Blacklist object</a></li>
                  <li><a href="/documentation#">Get a Blacklist</a></li>
                  <li><a href="/documentation#">List all Blacklist</a></li>
                  <li><a href="/documentation#">Create a Blacklist</a></li>
                  <li><a href="/documentation#">Update a Blacklist</a></li>
                  <li><a href="/documentation#">Destroy Blacklist</a></li>
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
