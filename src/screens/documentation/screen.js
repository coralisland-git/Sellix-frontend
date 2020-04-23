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
  { key: 'webhooks', value: 'Webhooks' },
  { key: 'blacklist', 
    value: 'Blacklist',
    children: [
      { key: 'blacklist-object', value: 'Blacklist Object' },    
      { key: 'get-blacklist', value: 'Get Blacklist' },
      { key: 'list-blacklist', value: 'List Blacklist' },
      { key: 'create-blacklist', value: 'Create a Blacklist' },
      { key: 'update-blacklist', value: 'Update a Blacklist' },
      { key: 'destroy-blacklist', value: 'Destroy a Blacklist' },
    ]
 }
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
        <div className="animated fadeIn">
          <div className="d-wrapper">          
            <div className="side-nav">
              <div className="d-nav">
                <ul className="section-nav">
                  {
                    NAVITATIONS.map((nav, index) => {
                      return (
                        <>
                          <li key={index}>
                            <a 
                              href={`/documentation#${nav.key}`} 
                              className={ key === nav.key && "active"}
                            >{nav.value}</a>
                          </li>
                          { nav.children && nav.children.map((child, cindex) => {
                            return (
                              <li className="sub-nav" key={cindex}>                                
                                <a 
                                  href={`/documentation#${child.key}`} 
                                  className={ key === child.key && "active"}
                                >{child.value}</a>
                              </li>
                            )
                          })}
                        </>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="d-content">
              <section id="introduction">
                <div className="d-ins">
                  <h3><b>Introduction</b></h3>
                  <p>
                    Welcome to the Sellix REST API. You can use our API to access Sellix API endpoints to build
                    your own systems on top of our platform. <br /><br />
                    We have official API libraries in multiple languages. You can view code examples to the right, 
                    and you can switch the programming language of the examples with the language selector at the
                    top or any code block.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ROOT URL
                    </div>
                    <div className="code-block-body">
                      https://sellix.io/api/v2
                    </div>
                  </div>
                </div>
              </section>
              <section id="authentication">
                <div className="d-ins">
                  <h3><b>Authentication</b></h3>
                  <p>
                    Sellix's API uses <a href="#">Basic authentication</a> with your account email and API key. This is usually done
                    via the <span class="badge-mark">Authorization</span> header <br /><br />
                    Your API key can be accessed and re-generated <a href="#">here</a><br /><br />
                    All API requests must be made over HTTPS.
                  </p>
                </div>
                <div className="d-ex">
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
                </div>
              </section>
              <section id="pagenation">
                <div className="d-ins">
                  <h3><b>Pagenation</b></h3>
                  <p>
                    Selly offers the ability to paginate any list endpoint. The <span class="badge-mark">X-Total-Pages</span> header returns 
                    the total number of pages for the resources at the specific endpoint you're using. <br/><br/>

                    By default, <span class="badge-mark">20</span> resources are displayed per page.
                  </p>
                  <p><b>Parameters</b></p>
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
                </div>
                <div className="d-ex">
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
                </div>
              </section>
              <section id="errors">
                <div className="d-ins">
                  <h3><b>Errors</b></h3>
                  <p>
                    Errors will only ever be present with a <span class="badge-mark">400</span> to <span class="badge-mark">503</span> HTTP response 
                    status. All errors will include a <span class="badge-mark">message</span> attribute detailing the error message. <br /><br />
                    Validation errors will feature a <span class="badge-mark">errors</span> attribute containing an array of error message strings. <br /><br />
                    The Selly API uses the following error codes:
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      Authentication Error
                    </div>
                    <div className="code-block-body">
                      
                    </div>
                  </div>
                </div>
              </section>
              <section id="webhooks">
                <div className="d-ins">
                  <h3><b>Webhook</b></h3>
                  <p>
                    Selly provides a webhooks system allowing you to subscribe to to events with <a href="#">Webhook Endpoints</a>, 
                    alongside Product/Payment Order status webhooks and Dynamic Product webhooks. <br /><br />

                    Please note <b>only HTTPS webhook URLs are supported</b>.<br /><br />

                    A webhook simulator is available allowing you to simulate webhooks to a URL. It can be accessed <a href="#">here</a>.<br /><br />
                  </p>
                  <b>Signing/Validating</b>
                  <p>
                    To verify the authenticity of a webhook request and its payload, each webhook request includes 
                    a <span class="badge-mark">X-Sellix-Signature</span> header with a 
                    HMAC signature comprised of the JSON encoded request body and your webhook secret. 
                    Your webhook secret can be changed in your <a href="#">settings page</a>. <br /><br />
                  </p>
                  <b>Events</b>
                  <p>
                    Each webhook request will feature a <span class="badge-mark">X-Sellix-Event</span> header containing the 
                    webhook event type. A list of supported events from <a href="#">Webhook Endpoints</a> can be found below.
                  </p>
                  <b>Logs</b>
                  <p>
                    Each webhook request will create a <a href="#">Webhook Log</a>. The object is created by the request 
                    has been sent. Before the request response has actually been received, the <span class="badge-mark">response_code</span> will 
                    be <span class="badge-mark">0</span>, indicating it is pending.<br /><br />
                    Each webhook request will also include a <span class="badge-mark">X-Sellix-Webhook</span> request header 
                    containing the <a href="#">Webhook Log</a> <span class="badge-mark">id</span>.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      VALIDATING SIGNED WEBHOOK SIGNATURE
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
              <section id="blacklist">
                <div className="d-ins">
                  <h3><b>Blacklist</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                      GET /api/v2/blacklist/:id <br />
                      GET /api/v2/blacklist <br />
                      POST /api/v2/blacklist <br />
                      PUT /api/v2/blacklist/:id <br />
                      DELETE /api/v2/blacklist/:id <br />
                    </div>
                  </div>
                </div>
              </section>
              <section id="blacklist-object">
                <div className="d-ins">
                  <h3><b>Blacklist Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>string</p>
                        </td>
                        <td>
                          Unique identifier for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">blacklist_type</p>
                          <p>integer</p>
                        </td>
                        <td>
                          1 for Email. 2 for IP address. 3 for Country Code
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">blocked_data</p>
                          <p>string</p>
                        </td>
                        <td>
                          Blocked data. Either country code, email or IP address
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">note</p>
                          <p>string</p>
                        </td>
                        <td>
                          Internal note for the reasoning of the blacklist
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">create_at</p>
                          <p>datetime</p>
                        </td>
                        <td>
                          The date and time that the resource was created.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">update_at</p>
                          <p>datetime</p>
                        </td>
                        <td>
                          The date and time that the resource was last updated. If never updated, it will be equal to created_at.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      THE BLACKLIST OBJECT
                    </div>
                    <div className="code-block-body">

                    </div>
                  </div>
                </div>
              </section>
              <section id="get-blacklist">
                <div className="d-ins">
                  <h3><b>Get Blacklist</b></h3>
                  <p>
                    <span className="param">GET</span> /api/v2/blacklist/:id <br />
                    Retrieves a Blacklist by ID
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">page</p>
                          <p>integer</p>
                        </td>
                        <td>
                          Page number for use in pagination
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
              <section id="list-blacklist">
                <div className="d-ins">
                  <h3><b>List Blacklist</b></h3>
                  <p>
                    <span className="param">GET</span> /api/v2/blacklist <br />
                    Returns a list of the Blacklist. The blacklist are sorted by creation date, with the most 
                    recently created blacklist being first.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
              <section id="create-blacklist">
                <div className="d-ins">
                  <h3><b>Create a Blacklist</b></h3>
                  <p>
                    <span className="param">POST</span> /api/v2/blacklist <br />
                    Creates a Blacklist and return the created Blacklist
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">blacklist_type</p>
                          <p>integer</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          1 for Email. 2 for IP address. 3 for Country Code
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">blacklist_data</p>
                          <p>string</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Blocked data. Either country code, email or IP address
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">note</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Internal note for the reasoning of the blacklist
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
              <section id="update-blacklist">
                <div className="d-ins">
                  <h3><b>Update Blacklist</b></h3>
                  <p>
                    <span className="param">PUT</span> /api/v2/blacklist/:id <br />
                    Update a Blacklist by ID and return the updated Blacklist
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">blacklist_type</p>
                          <p>integer</p>                          
                        </td>
                        <td>
                          1 for Email. 2 for IP address. 3 for Country Code
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">blacklist_data</p>
                          <p>string</p>
                        </td>
                        <td>
                          Blocked data. Either country code, email or IP address
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">note</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Internal note for the reasoning of the blacklist
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
              <section id="destroy-blacklist">
                <div className="d-ins">
                  <h3><b>Destroy Blacklist</b></h3>
                  <p>
                    <span className="required">DELETE</span> /api/v2/blacklist/:id <br />
                    Destroys a Blacklist by ID
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      ENDPOINTS
                    </div>
                    <div className="code-block-body">
                    </div>
                  </div>
                </div>
              </section>
            </div>  
          </div>          
        </div>        
      </div>
    );
  }
}

export default Documentation;
