import React from "react";
import {
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Col,  
  Row,
  Collapse,
  Container
} from "reactstrap";
import { Link } from "react-router-dom";
import sellix_logo from "assets/images/Sellix_logo.svg";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { sunburst, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Scrollspy from 'react-scrollspy';
import Clipboard from 'react-clipboard.js';

import "./style.scss";

const NAVITATIONS = [
  { key: 'introduction', value: 'Introduction' },
  { key: 'authentication', value: 'Authentication' },
  { key: 'pagination', value: 'Pagination' },
  { key: 'errors', value: 'Errors' },
  { key: 'webhooks', value: 'Webhooks' }
]

const API_NAVIGATIONS = [
  { key: 'blacklist-blacklist', value: 'Blacklist', has_children: true },
  { key: 'object-blacklist', value: 'Blacklist Object' },
  { key: 'get-blacklist', value: 'Get Blacklist' },
  { key: 'list-blacklist', value: 'List Blacklist' },
  { key: 'create-blacklist', value: 'Create a Blacklist' },
  { key: 'update-blacklist', value: 'Update a Blacklist' },
  { key: 'destroy-blacklist', value: 'Destroy a Blacklist' },
  
  { key: 'categories-category', value: 'Categories', has_children: true },
  { key: 'object-category', value: 'Category Object' },
  { key: 'get-category', value: 'Get a Category' },
  { key: 'list-category', value: 'List All Categories' },
  { key: 'create-category', value: 'Create a Category' },
  { key: 'edit-category', value: 'Edit Category' },
  { key: 'delete-category', value: 'Delete Category' },
  
  { key: 'coupons-coupon', value: 'Coupons', has_children: true },
  { key: 'object-coupon', value: 'Coupon Object' },
  { key: 'get-coupon', value: 'Get a Coupon' },
  { key: 'list-coupon', value: 'List All Coupons' },
  { key: 'create-coupon', value: 'Create a Coupon' },
  { key: 'edit-coupon', value: 'Edit Coupon' },
  { key: 'delete-coupon', value: 'Delete Coupon' },

  { key: 'feedback-feedback', value: 'Feedback', has_children: true },
  { key: 'object-feedback', value: 'Feedback Object' },
  { key: 'get-feedback', value: 'Get a Feedback' },
  { key: 'list-feedback', value: 'List All Feedback' },
  { key: 'reply-feedback', value: 'Reply Feedback' },

  { key: 'orders-order', value: 'Orders', has_children: true },
  { key: 'object-order', value: 'Order Object' },
  { key: 'get-order', value: 'Get an Order' },
  { key: 'list-order', value: 'List All Orders' },
]

const userId = window.localStorage.getItem('userId')

class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      activeNode: null
    };
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  componentDidMount() {
    var key = this.props.history.location.hash.substr(1);    
    if (key !== "")
      this.setState({initial : true})
  }

  onUpdateScroll(el) {
    if((el.id !== "introduction" && !this.state.initial) || !this.state.initial){
      this.props.history.push(`/documentation#${el.id}`)
    }
    else
      this.setState({initial: false})
    if(el)
      this.setState({activeNode: el.id.split('-')[1]})
  }
   
  render() {

    var {activeNode} = this.state;

    var items = ['get_started'];
    NAVITATIONS.map((nav => {
        items.push(nav.key)
    }))

    items.push('api_reference');    

    API_NAVIGATIONS.map((nav => {
      items.push(nav.key)
    }))


    return (
      <div className="documentation-screen">
        <div className="animated fadeIn">
          <div className="d-wrapper">          
            <div className="side-nav">
              <div className="d-nav">
                <Scrollspy items={ items }
                  className="section-nav"
                  currentClassName="active"
                  offset={ -50 }                  
                  onUpdate={
                    (el) => this.onUpdateScroll(el)
                  }>
                  <li className="field">GET STARTED</li>
                  {
                    NAVITATIONS.map((nav, index) => {
                      return (
                        <li key={index}>
                          <a 
                            href={`/documentation#${nav.key}`} 
                          >{nav.value}</a>
                        </li>
                      )
                    })
                  }
                  <li className="field">API REFERENCE</li>
                  {
                    API_NAVIGATIONS.map((nav, cindex) => {
                      return (
                        <li className={ nav.has_children ? 'parent' : nav.key.indexOf(activeNode) > -1 ? 'sub-nav show' : 'sub-nav' } key={cindex}>
                          <a href={`/documentation#${nav.key}`} 
                          >{nav.value}</a>
                        </li>
                       )
                     })
                  }
                </Scrollspy>
              </div>
            </div>
            <Container className="d-content" fluid>
              <section id="introduction">
                <div className="d-ins">
                  <h3><b>Introduction</b></h3>
                  <p>
                    Welcome to the Sellix REST API. You can use our API to access Sellix API endpoints to build 
                    your own systems on top of our platform. <br /><br />
                    You can view code examples to the right, at the moment the only available language to view 
                    example code is PHP, more will come in the future.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>API ROOT URL</p>
                      <Clipboard data-clipboard-text={ `https://sellix.io/api/v1` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst}>
                      {`https://sellix.io/api/v1`}
                    </SyntaxHighlighter>                    
                  </div>
                </div>
              </section>
              <section id="authentication">
                <div className="d-ins">
                  <h3><b>Authentication</b></h3>
                  <p>
                    Sellix's API uses a Bearer authentication with your API Secret Key. 
                    You will have to send your API Secret Key via the <span className="badge-mark">Authorization</span>  header. <br /><br />

                    Your API key can be accessed and re-generated <a href="https://sellix.io/settings/security">here</a> in the security tab. <br /><br />

                    All API requests must be made over HTTPS.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>SETUP AUTHENTICATION HEADER</p>
                      <Clipboard 
                      data-clipboard-text={ `Authorization: Bearer testingjHdAZK6jG2pN6cabSQdZhlS2XqE8UvOSdqSDtlZAeOuF2jfr3a87KKs3Z` } 
                      button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst}>
                      {`Authorization: Bearer testingjHdAZK6jG2pN6cabSQdZhlS2XqE8UvOSdqSDtlZAeOuF2jfr3a87KKs3Z`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="pagination">
                <div className="d-ins">
                  <h3><b>Pagination</b></h3>
                  <p>
                    Sellix offers the ability to paginate any list endpoint. <br/>
                    By default, <span className="badge-mark">15</span> resources are displayed per page. <br/><br/>
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
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>PAGINATING ORDERS EXAMPLE</p>
                      <Clipboard 
                      data-clipboard-text={ `/blacklists?page=1` } 
                      button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst}>
                      {`/blacklists?page=1`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="errors">
                <div className="d-ins">
                  <h3><b>Errors</b></h3>
                  <p>
                    Errors will only ever be present with a <span className="badge-mark">400</span> to <span className="badge-mark">503</span> HTTP response 
                    status. All errors will include a <span className="badge-mark">message</span> attribute detailing the error message. <br /><br />
                    Validation errors will feature a <span className="badge-mark">errors</span> attribute containing an array of error message strings. <br /><br />
                    The Sellix API uses the following error codes:
                  </p>
                  <table className="border-table">
                    <thead>
                      <tr>
                        <th>STATUS</th>
                        <th>MEANING</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><p className="param">400</p></td>
                        <td>Bad Request - Invalid parameters</td>
                      </tr>
                      <tr>
                        <td><p className="param">401</p></td>
                        <td>Unauthorized - Unable to authenticate</td>
                      </tr>
                      <tr>
                        <td><p className="param">403</p></td>
                        <td>Forbidden - The request is not allowed</td>
                      </tr>
                      <tr>
                        <td><p className="param">404</p></td>
                        <td>Not Found - The specified resource could not be found.</td>
                      </tr>
                      <tr>
                        <td><p className="param">406</p></td>
                        <td>Not Acceptable - You requested a format that isn't json.</td>
                      </tr>
                      <tr>
                        <td><p className="param">429</p></td>
                        <td>Too Many Requests - You have reached the rate limit</td>
                      </tr>
                      <tr>
                        <td><p className="param">500</p></td>
                        <td>Internal Server Error - We had a problem with our server. Try again later. These are rare.</td>
                      </tr>
                      <tr>
                        <td><p className="param">503</p></td>
                        <td>Service Unavailable - We're temporarily offline for maintenance. Please try again later.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>VALIDATION ERROR</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 400,
    "data": null,
    "message": null,
    "log": null,
    "error": "Invalid Product Title.",
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>AUTHENTICATION ERROR</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 401,
    "data": null,
    "message": null,
    "log": "testingjHdAZK6jG2pN6cabSQdZhlS2XqE8UvOSdqSDtlZAeOuF2jfr3a87KKs3Z",
    "error": "Unauthorized",
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>NOT FOUND ERROR</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 404,
    "data": null,
    "message": null,
    "log": null,
    "error": "Not Found.",
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="webhooks">
                <div className="d-ins">
                  <h3><b>Webhooks</b></h3>
                  <p>
                    Sellix provides a webhooks system allowing you to subscribe to to events 
                    with <a href="https://sellix.io/webhooks">Webhook Endpoints</a>, 
                    alongside Product/Payment Order status webhooks and Dynamic Product webhooks. <br /><br />
                    Please note <b>only HTTPS webhook URLs are supported</b>.<br /><br />
                    A webhook simulator is available allowing you to simulate webhooks to a URL. It can be 
                    accessed <a href="https://sellix.io/webhooks/simulate">here</a>.<br /><br />
                  </p>
                  <p><b>Signing/Validating</b></p>
                  <p>
                    To verify the authenticity of a webhook request and its payload, each webhook request includes 
                    a <span className="badge-mark">X-Sellix-Signature</span> header with a 
                    HMAC signature comprised of the JSON encoded request body and your webhook secret. 
                    Your webhook secret can be changed in your <a href='https://sellix.io/settings/security'>settings page</a>. <br /><br />
                  </p>
                  <p><b>Events</b></p>
                  <p>
                    Each webhook request will feature a <span className="badge-mark">X-Sellix-Event</span> header containing the 
                    webhook event type. A list of supported events from <a href="https://sellix.io/webhooks">Webhook Endpoints</a> can be found below.
                  </p>
                  <table className="border-table">
                    <thead>
                      <tr>
                        <th className="table-title" colspan="3">EVENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge-mark">order:created</span></td>
                        <td><span className="badge-mark">order:updated</span></td>
                        <td><span className="badge-mark">order:partial</span></td>                      
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:paid</span></td>
                        <td><span className="badge-mark">order:paid:product</span></td>
                        <td><span className="badge-mark">order:cancelled</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">product:created</span></td>                      
                        <td><span className="badge-mark">product:stock</span></td>
                        <td><span className="badge-mark">product:edited</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">query:created</span></td>
                        <td><span className="badge-mark">query:replied</span></td>
                        <td><span className="badge-mark"> feedback:received</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    <br /><br /><b>Logs</b>
                  </p>
                  <p>
                    Each webhook request will create a <a href="https://sellix.io/webhooks/simulate">Webhook Log</a>. The object is created by the request 
                    has been sent. Before the request response has actually been received, the <span className="badge-mark">response_code</span> will 
                    be <span className="badge-mark">0</span>, indicating it is pending.<br /><br />
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>VALIDATING SIGNED WEBHOOK SIGNATURE</p>
                      <Clipboard 
                      data-clipboard-text={ `$payload = file_get_contents('php://input');

$secret = "testing981y25n89byoas7by"; // replace with your webhook secret
$header_signature = $_SERVER["HTTP_X_SELLIX_SIGNATURE"]; // get our signature header

$signature = hash_hmac('sha512', $payload, $secret);
if (hash_equals($signature, $header_signature)) {
  // handle valid webhook
}` } 
                      button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`$payload = file_get_contents('php://input');

$secret = "testing981y25n89byoas7by"; // replace with your webhook secret
$header_signature = $_SERVER["HTTP_X_SELLIX_SIGNATURE"]; // get our signature header

$signature = hash_hmac('sha512', $payload, $secret);
if (hash_equals($signature, $header_signature)) {
  // handle valid webhook
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="blacklist-blacklist">
                <div className="d-ins">
                  <h3><b>Blacklist</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>ENDPOINTS</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /blacklists/:uniqid
GET /blacklists
POST /blacklists
PUT /blacklists/:uniqid
DELETE /blacklists/:uniqid`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="object-blacklist">
                <div className="d-ins">
                  <h3><b>Blacklist Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>int</p>
                        </td>
                        <td>
                          Unique id, auto incremented for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">uniqid</p>
                          <p>string</p>
                        </td>
                        <td>
                          Unique identifier for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">type</p>
                          <p>string</p>
                        </td>
                        <td>
                          Can be email, ip or country.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">data</p>
                          <p>string</p>
                        </td>
                        <td>
                          Blocked data. Either country code, email or IP address.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">note</p>
                          <p>string</p>
                        </td>
                        <td>
                          Internal note for the reasoning of the blacklist.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">created_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was created.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">update_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was last updated. If never updated, it will be equal to created_at.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>THE BLACKLIST OBJECT</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "id": 0,
    "uniqid": "testing63d725",
    "user_id": 0,
    "type": "ip",
    "data": "1.2.3.5.6",
    "note": "Demo Blacklist",
    "created_at": 1586045814,
    "updated_at": 1586515431
}`}
                    </SyntaxHighlighter>
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
                </div>
                <div className="d-ex">
                  {/*<div className="code-block">
                        <div className="code-block-header">
                          <p>GET A BLACKLIST</p>
                          <Clipboard data-clipboard-text={ `Sellix::Blacklist.retrieve('bGYSEexV')` } button-title="Copy">
                            <i className="fa fa-clone" aria-hidden="true"></i>
                          </Clipboard>
                        </div>
                        <SyntaxHighlighter language="php" style={sunburst}>
                          {`Sellix::Blacklist.retrieve('bGYSEexV')`}
                        </SyntaxHighlighter>
                      </div>*/}
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight} showLineNumbers={true}>
                      {`{
    "status": 200,
    "data": {
        "blacklist": {
            "id": 0,
            "uniqid": "testing63d725",
            "user_id": 0,
            "type": "ip",
            "data": "1.2.3.5.6",
            "note": "Demo Blacklist",
            "created_at": 1586045814,
            "updated_at": 1586515431
        }
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="list-blacklist">
                <div className="d-ins">
                  <h3><b>List Blacklist</b></h3>
                  <p>
                    <span className="param">GET</span> /blacklist <br />
                    Returns a list of the Blacklist. The blacklist are sorted by creation date, with the most 
                    recently created blacklist being first.
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
                  {/*<div className="code-block">
                    <div className="code-block-header">
                      <p>LIST ALL BLACKLIST</p>
                      <Clipboard data-clipboard-text={ `Sellix::Blacklist.list` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`Sellix::Blacklist.list`}
                    </SyntaxHighlighter>
                  </div>*/}
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "blacklists": [
            {
                "id": 0,
                "uniqid": "testing63d725",
                "user_id": 0,
                "type": "ip",
                "data": "1.2.3.5.6",
                "note": "Demo Blacklist",
                "created_at": 1586045814,
                "updated_at": 1586515431
            }
        ] 
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="create-blacklist">
                <div className="d-ins">
                  <h3><b>Create a Blacklist</b></h3>
                  <p>
                    <span className="param">PUT</span> /blacklist <br />
                    Creates a Blacklist and returns the Uniqid. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">type</p>
                          <p>string</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Can be email, ip or country.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">data</p>
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
                          Internal note for the reasoning of the blacklist.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>CREATE BLACKLIST REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "type": "ip",
    "data": "1.2.3.4",
    "note": "demo"
}
` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "type": "ip",
    "data": "1.2.3.4",
    "note": "demo"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "uniqid": "testingbb6ac5"
    },
    "message": "Blacklist Created Successfully.",
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="update-blacklist">
                <div className="d-ins">
                  <h3><b>Edit Blacklist</b></h3>
                  <p>
                    <span className="param">POST</span> /blacklists/:uniqid <br />
                    Edits a Blacklist. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">type</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Can be email, ip or country.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">data</p>
                          <p>string</p>
                        </td>
                        <td>
                          Blocked data. Either country code, email or IP address.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">note</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Internal note for the reasoning of the blacklist.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>EDIT BLACKLIST REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "type": "country",
    "data": "IT",
    "note": "demo editing"
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "type": "country",
    "data": "IT",
    "note": "demo editing"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": null,
    "message": "Blacklist Edited Successfully.",
    "log": null,
    "error": null,
    "env": "staging"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="destroy-blacklist">
                <div className="d-ins">
                  <h3><b>Delete Blacklist</b></h3>
                  <p>
                    <span className="required">DELETE</span> /blacklists/:uniqid <br />
                    Deletes a Blacklist.
                  </p>
                </div>
                <div className="d-ex">
                  {/*<div className="code-block">
                        <div className="code-block-header">
                          <p>DESTROY A BLACKLIST</p>
                          <Clipboard data-clipboard-text={ `Sellix::Blacklist.destroy('bGYSEexV')` } button-title="Copy">
                            <i className="fa fa-clone" aria-hidden="true"></i>
                          </Clipboard>
                        </div>
                        <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                          {`Sellix::Blacklist.destroy('bGYSEexV')`}
                        </SyntaxHighlighter>
                      </div>*/}
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": null,
    "message": "Blacklist Deleted Successfully.",
    "log": null,
    "error": null,
    "env": "staging"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="categories-category">
                <div className="d-ins">
                  <h3><b>Categories</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>ENDPOINTS</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /categories/:uniqid
GET /categories
POST /categories
PUT /categories/:uniqid
DELETE /categories/:uniqid`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="object-category">
                <div className="d-ins">
                  <h3><b>Category Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>int</p>
                        </td>
                        <td>
                          Unique id, auto incremented for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">uniqid</p>
                          <p>string</p>
                        </td>
                        <td>
                          Unique identifier for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">user_id</p>
                          <p>int</p>
                        </td>
                        <td>
                          ID of the user who created the category.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">title</p>
                          <p>string</p>
                        </td>
                        <td>
                          Title of the category, displayed in the site.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">unlisted</p>
                          <p>int</p>
                        </td>
                        <td>
                          0 or 1, if 1 the category is not displayed on the shop page.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">sort_priority</p>
                          <p>int</p>
                        </td>
                        <td>
                          Used to order the categories on the shop page, ordered by ASC.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>
                        </td>
                        <td>
                          Array of products objects that the category contains.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_count</p>
                          <p>int</p>
                        </td>
                        <td>
                          Count of how many items the products_bound array contains.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">created_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was created.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">updated_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was last updated. If never updated, it will be NULL.
                        </td>
                      </tr>
                    </tbody>                          
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>THE CATEGORY OBJECT</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "id": 0,
    "uniqid": "testing9ced89",
    "user_id": 0,
    "title": "Demo Category",
    "unlisted": 0,
    "sort_priority": 1,
    "products_bound": [],
    "products_count": 0,
    "created_at": 1587110377,
    "updated_at": null
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="get-category">
                <div className="d-ins">
                  <h3><b>Get a Category</b></h3>
                  <p>
                    <span className="required">GET</span> /categories/:uniqid <br />
                    Retrieves a Category by Uniqid.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "category": {
            "id": 0,
            "uniqid": "testing9ced89",
            "user_id": 0,
            "title": "Demo Category",
            "unlisted": 0,
            "sort_priority": 1,
            "products_bound": [],
            "products_count": 0,
            "created_at": 1587110377,
            "updated_at": null
        }
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="list-category">
                <div className="d-ins">
                  <h3><b>List All Categories</b></h3>
                  <p>
                    <span className="required">GET</span> /categories <br />
                    Returns a list of all the Categories. The categories are sorted by creation date, with the most recently created categories being first.
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">page</p>
                          <p>integer</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "categories": [
            {
                "id": 0,
                "uniqid": "testing9ced89",
                "user_id": 0,
                "title": "Demo Category",
                "unlisted": 0,
                "sort_priority": 1,
                "products_bound": [],
                "products_count": 0,
                "created_at": 1587110377,
                "updated_at": null
            }
        ]
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="create-category">
                <div className="d-ins">
                  <h3><b>Create a Category</b></h3>
                  <p>
                    <span className="required">PUT</span> /categories <br />
                    Creates a Category and returns the Uniqid. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">title</p>
                          <p>string</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Title of the category, displayed in the site.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">unlisted</p>
                          <p>int or boolean</p>                          
                        </td>
                        <td>
                          0 or 1, true or false, if 1/true the category is not displayed on the shop page.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">sort_priority</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Used to order the categories on the shop page, ordered by ASC.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>                          
                        </td>
                        <td>
                          Array of products uniqids that the category will contain.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>CREATE CATEGORY REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "title": "Demo Category",
    "unlisted": false,
    "sort_priority": 1,
    "products_bound": [
        "testing26bf06"
    ]
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "title": "Demo Category",
    "unlisted": false,
    "sort_priority": 1,
    "products_bound": [
        "testing26bf06"
    ]
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "uniqid": "testing391049"
    },
    "message": "Category Created Successfully.",
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="edit-category">
                <div className="d-ins">
                  <h3><b>Edit Category</b></h3>
                  <p>
                    <span className="required">POST</span> /categories/:uniqid <br />
                    Edits a Category. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">title</p>
                          <p>string</p>
                        </td>
                        <td>
                          Title of the category, displayed in the site.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">unlisted</p>
                          <p>int or boolean</p>                          
                        </td>
                        <td>
                          0 or 1, true or false, if 1/true the category is not displayed on the shop page.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">sort_priority</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Used to order the categories on the shop page, ordered by ASC.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>                          
                        </td>
                        <td>
                          Array of products uniqids that the category will contain.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>EDIT CATEGORY REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "title": "Demo Category Edited",
    "unlisted": false,
    "sort_priority": 1,
    "products_bound": [
        "testing8h9ba4s"
    ]
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "title": "Demo Category Edited",
    "unlisted": false,
    "sort_priority": 1,
    "products_bound": [
        "testing8h9ba4s"
    ]
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "uniqid": "testing391049"
    },
    "message": "Category Edited Successfully.",
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="delete-category">
                <div className="d-ins">
                  <h3><b>Delete Category</b></h3>
                  <p>
                    <span className="required">DELETE</span> /categories/:uniqid <br />
                    Deletes a Category.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": null,
    "message": "Category Deleted Successfully.",
    "log": null,
    "error": null,
    "env": "staging"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="coupons-coupon">
                <div className="d-ins">
                  <h3><b>Coupons</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>ENDPOINTS</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /coupons/:uniqid
GET /coupons
POST /coupons
PUT /coupons/:uniqid
DELETE /coupons/:uniqid`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="object-coupon">
                <div className="d-ins">
                  <h3><b>Coupon Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>int</p>
                        </td>
                        <td>
                          Unique id, auto incremented for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">uniqid</p>
                          <p>string</p>
                        </td>
                        <td>
                          Unique identifier for the object.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">user_id</p>
                          <p>int</p>
                        </td>
                        <td>
                          ID of the user who created the category.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">code</p>
                          <p>string</p>
                        </td>
                        <td>
                          Coupon code, used by customers to reedem the discount.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">use_type</p>
                          <p>int</p>
                        </td>
                        <td>
                          0 or 1, if 0 means that the coupon is linked to specific products, 1 it’s valid for all.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">discount</p>
                          <p>float</p>
                        </td>
                        <td>
                          Percentage value of the discount.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">used</p>
                          <p>int</p>
                        </td>
                        <td>
                          How many times the coupon has been used.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">max_uses</p>
                          <p>int</p>
                        </td>
                        <td>
                          How many times can the coupon be used, -1 for unlimited.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>
                        </td>
                        <td>
                          Array of products uniqids that the coupon is valid for.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_count</p>
                          <p>int</p>
                        </td>
                        <td>
                          Count of how many items the products_bound array contains.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">created_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was created.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">updated_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>
                          The date and time that the resource was last updated. If never updated, it will be NULL.
                        </td>
                      </tr>
                    </tbody>                          
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>THE COUPON OBJECT</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "id": 0,
    "uniqid": "testing1990aa",
    "user_id": 0,
    "code": "demo",
    "use_type": 0,
    "discount": 65,
    "used": 0,
    "max_uses": -1,
    "products_bound": [
        "testing1990aa"
    ],
    "products_count": 1,
    "created_at": 1585490881,
    "updated_at": 1586354410
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="get-coupon">
                <div className="d-ins">
                  <h3><b>Get a Coupon</b></h3>
                  <p>
                    <span className="required">GET</span> /coupons/:uniqid <br />
                    Retrieves a Coupon by Uniqid.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "coupon": {
            "id": 0,
            "uniqid": "testing1990aa",
            "user_id": 0,
            "code": "demo",
            "use_type": 0,
            "discount": 65,
            "used": 0,
            "max_uses": -1,
            "products_bound": [
                "testing1990aa"
            ],
            "products_count": 1,
            "created_at": 1585490881,
            "updated_at": 1586354410
        }
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="list-coupon">
                <div className="d-ins">
                  <h3><b>List All Coupons</b></h3>
                  <p>
                    <span className="required">GET</span> /coupons <br />
                    Returns a list of all the Coupons. The coupons are sorted by creation date, with the most recently created coupons being first.
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">page</p>
                          <p>integer</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "coupons": [
            {
                "id": 0,
                "uniqid": "testing1990aa",
                "user_id": 0,
                "code": "demo",
                "use_type": 0,
                "discount": 65,
                "used": 0,
                "max_uses": -1,
                "products_bound": [
                    "testing1990aa"
                ],
                "products_count": 1,
                "created_at": 1585490881,
                "updated_at": 1586354410
            }
        ]
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="create-coupon">
                <div className="d-ins">
                  <h3><b>Create a Coupon</b></h3>
                  <p>
                    <span className="required">PUT</span> /coupon <br />
                    Creates a Coupon and returns the Uniqid.<br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">code</p>
                          <p>string</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Code of the Coupon.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">discount_value</p>
                          <p>float</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Percentage amount of the discount.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">max_uses</p>
                          <p>int</p>                          
                        </td>
                        <td>
                          How many times can the coupon be used, defaulted to -1.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>                          
                        </td>
                        <td>
                          Array of products uniqids that the category will contain.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>CREATE COUPON REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "code": "demo",
    "discount_value": 65,
    "max_uses": -1,
    "products_bound": [
        "testing1990aa"
    ]
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "code": "demo",
    "discount_value": 65,
    "max_uses": -1,
    "products_bound": [
        "testing1990aa"
    ]
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "uniqid": "testing391049"
    },
    "message": "Coupon Created Successfully.",
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="edit-coupon">
                <div className="d-ins">
                  <h3><b>Edit Coupon</b></h3>
                  <p>
                    <span className="required">POST</span> /coupons/:uniqid <br />
                    Edits a Coupon. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">code</p>
                          <p>string</p>                          
                        </td>
                        <td>
                          Code of the Coupon.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">discount_value</p>
                          <p>float</p>                          
                        </td>
                        <td>
                          Percentage amount of the discount.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">max_uses</p>
                          <p>int</p>                          
                        </td>
                        <td>
                          How many times can the coupon be used, defaulted to -1.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">products_bound</p>
                          <p>array</p>                          
                        </td>
                        <td>
                          Array of products uniqids that the category will contain.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>EDIT COUPON REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "code": "demo",
    "discount_value": 65,
    "max_uses": -1,
    "products_bound": [
        "testing1990aa"
    ]
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "code": "demo",
    "discount_value": 65,
    "max_uses": -1,
    "products_bound": [
        "testing1990aa"
    ]
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "uniqid": "testing391049"
    },
    "message": "Coupon Edited Successfully.",
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="delete-coupon">
                <div className="d-ins">
                  <h3><b>Delete Coupon</b></h3>
                  <p>
                    <span className="required">DELETE</span> /coupons/:uniqid <br />
                    Deletes a Coupon.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": null,
    "message": "Coupon Deleted Successfully.",
    "log": null,
    "error": null,
    "env": "staging"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>

              <section id="feedback-feedback">
                <div className="d-ins">
                  <h3><b>Feedback</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>ENDPOINTS</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /feedback/:uniqid
GET /feedback
POST /feedback/reply/:uniqid`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="object-feedback">
                <div className="d-ins">
                  <h3><b>Feedback Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>int</p>
                        </td>
                        <td>Unique id, auto incremented for the object.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">uniqid</p>
                          <p>string</p>
                        </td>
                        <td>Unique identifier for the object.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">invoice_id</p>
                          <p>string</p>
                        </td>
                        <td>Unique identifier for the feedback’s invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product_id</p>
                          <p>string</p>
                        </td>
                        <td>Unique identifier for the feedback’s product.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">user_id</p>
                          <p>int</p>
                        </td>
                        <td>ID of the user who created the product and earned the invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">message</p>
                          <p>string</p>
                        </td>
                        <td>Customer feedback message.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">reply</p>
                          <p>string</p>
                        </td>
                        <td>Seller’s reply to the customer message.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">feedback</p>
                          <p>string</p>
                        </td>
                        <td>Can be neutral, positive, negative.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">score</p>
                          <p>int</p>
                        </td>
                        <td>Range from 0 (feedback not left yet) to 5.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">invoice</p>
                          <p>object</p>
                        </td>
                        <td>Contains the full invoice object for this feedback.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product</p>
                          <p>object</p>
                        </td>
                        <td>Contains the full product object for this feedback.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">created_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>The date and time that the resource was created.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">updated_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>The date and time that the resource was last updated. If never updated, it will be 0.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>THE FEEDBACK OBJECT</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "id": 0,
    "uniqid": "demo-a877c78890",
    "invoice_id": "demo-bcbf00a68c",
    "product_id": "demo930bf1",
    "user_id": 0,
    "message": "demo",
    "reply": "demo reply",
    "feedback": "neutral",
    "score": 5,
    "created_at": 1586207430,
    "updated_at": 1588684803,
    "invoice": {
        ...
    },
    "product": {
        ...
    }
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="get-feedback">
                <div className="d-ins">
                  <h3><b>Get a Feedback</b></h3>
                  <p>
                    <span className="required">GET</span> /feedback/:uniqid <br />
                    Retrieves a Feedback by Uniqid.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "feedback": {
            "id": 0,
            "uniqid": "demo-a877c78890",
            "invoice_id": "demo-bcbf00a68c",
            "product_id": "demo930bf1",
            "user_id": 0,
            "message": "demo",
            "reply": "demo reply",
            "feedback": "neutral",
            "score": 5,
            "created_at": 1586207430,
            "updated_at": 1588684803,
            "invoice": {
                ...
            },
            "product": {
                ...
            }
        }
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="list-feedback">
                <div className="d-ins">
                  <h3><b>List All Feedback</b></h3>
                  <p>
                    <span className="required">GET</span> /feedback <br />
                    Returns a list of all the Feedback. The feedback are sorted by creation date, with the most recently created feedback being first. <br />
                    Invoice and Product objects are not shown in the list endpoint.
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">page</p>
                          <p>integer</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "feedbacks": [
            {
                "id": 0,
                "uniqid": "demo-a877c78890",
                "invoice_id": "demo-bcbf00a68c",
                "product_id": "demo930bf1",
                "user_id": 0,
                "message": "demo",
                "reply": "demo reply",
                "feedback": "neutral",
                "score": 5,
                "created_at": 1586207430,
                "updated_at": 1588684803
            }
        ]
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="reply-feedback">
                <div className="d-ins">
                  <h3><b>Reply Feedback</b></h3>
                  <p>
                    <span className="required">POST</span> /feedback/:uniqid <br />
                    Replies to a Feedback. <br /><br />
                  </p>
                  <p><b>Arguments</b></p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">reply</p>
                          <p>string</p>
                          <p className="required">REQUIRED</p>
                        </td>
                        <td>
                          Desired reply to the feedback.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block">
                    <div className="code-block-header">
                      <p>REPLY FEEDBACK REQUEST</p>
                      <Clipboard data-clipboard-text={ `{
    "reply": "demo feedback reply"
}` } button-title="Copy">
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </Clipboard>
                    </div>
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
                      {`{
    "reply": "demo feedback reply"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": null,
    "message": "Feedback Replied Successfully.",
    "log": null,
    "error": null,
    "env": "staging"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>

              <section id="orders-order">
                <div className="d-ins">
                  <h3><b>Orders</b></h3>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>ENDPOINTS</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /orders/:uniqid
GET /oders`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="object-order">
                <div className="d-ins">
                  <h3><b>Order Object</b></h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">id</p>
                          <p>int</p>
                        </td>
                        <td>Unique id, auto incremented for the object.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">uniqid</p>
                          <p>string</p>
                        </td>
                        <td>Unique identifier for the object.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">total</p>
                          <p>float</p>
                        </td>
                        <td>Total of the invoice in USD.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">total_display</p>
                          <p>float</p>
                        </td>
                        <td>Total of the invoice in the product’s currency.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">currency</p>
                          <p>float</p>
                        </td>
                        <td>Invoice currency, taken from the product’s.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">user_id</p>
                          <p>int</p>
                        </td>
                        <td>ID of the user who created the product and earned the invoice (your id).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">username</p>
                          <p>string</p>
                        </td>
                        <td>username of the user who created the product and earned the invoice your username).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product_id</p>
                          <p>string</p>
                        </td>
                        <td>Unique identifier for the invoice’s product.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product_type</p>
                          <p>string</p>
                        </td>
                        <td>Quick access, invoice’s product type, can be serials, file or service.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product_price</p>
                          <p>float</p>
                        </td>
                        <td>Price of the invoice’s product.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">file_attachment_uniqid</p>
                          <p>string</p>
                        </td>
                        <td>If the product_type is file, the invoice has a linked file uniqid.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">gateway</p>
                          <p>string</p>
                        </td>
                        <td>Can be bitcoin, litecoin, bitcoincash, ethereum, paypal, stripe, skrill, perfectmoney.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">paypal_email</p>
                          <p>string</p>
                        </td>
                        <td>User’s PayPal email used to create the PayPal Order (your PayPal email).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">paypal_tx_id</p>
                          <p>string</p>
                        </td>
                        <td>PayPal transaction ID used to process the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">paypal_payer_email</p>
                          <p>string</p>
                        </td>
                        <td>Email of the customer who bought through PayPal.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">skrill_email</p>
                          <p>string</p>
                        </td>
                        <td>User’s Skrill email used to create the Skrill Order (your Skrill email).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">skrill_sid</p>
                          <p>string</p>
                        </td>
                        <td>Skrill transaction ID used to process the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">skrill_link</p>
                          <p>string</p>
                        </td>
                        <td>Skrill link where the customer is redirected to proceed with the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">stripe_id</p>
                          <p>string</p>
                        </td>
                        <td>Stripe PaymentIntend id.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">stripe_client_secret</p>
                          <p>string</p>
                        </td>
                        <td>Stripe secret taken from the user (your client secret).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">perfectmoney_id</p>
                          <p>string</p>
                        </td>
                        <td>PerfectMoney user account id (your account id).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_address</p>
                          <p>string</p>
                        </td>
                        <td>Crypto Address where the crypto_amount should be sent to.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_amount</p>
                          <p>float</p>
                        </td>
                        <td>Crypto Amount needed to fulfill the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_received</p>
                          <p>float</p>
                        </td>
                        <td>Crypto Amount received so far.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_uri</p>
                          <p>string</p>
                        </td>
                        <td>URI to create the Crypto QRCode.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_confirmations</p>
                          <p>int</p>
                        </td>
                        <td>How many confirmations are needed to confirm a transaction.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">country</p>
                          <p>string</p>
                        </td>
                        <td>Customer’s country.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">location</p>
                          <p>string</p>
                        </td>
                        <td>Customer’s location</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">ip</p>
                          <p>string</p>
                        </td>
                        <td>Customer’s IP</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">is_vpn_or_proxy</p>
                          <p>bool</p>
                        </td>
                        <td>True if the customer IP is a VPN or a Proxy.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">user_agent</p>
                          <p>string</p>
                        </td>
                        <td>Customer’s user agent.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">quantity</p>
                          <p>int</p>
                        </td>
                        <td>Products quantity.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">coupon_id</p>
                          <p>string</p>
                        </td>
                        <td>If a coupon is used, this will contain its ID.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">custom_fields</p>
                          <p>object</p>
                        </td>
                        <td>Contains every custom field submitted for the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">developer_invoice</p>
                          <p>bool</p>
                        </td>
                        <td>If true, this invoice was created through Sellix Developer’s API.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">developer_title</p>
                          <p>string</p>
                        </td>
                        <td>Can be NULL, title specified when creating the invoice through Sellix Developer’s API.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">developer_webhook</p>
                          <p>string</p>
                        </td>
                        <td>Can be NULL, webhook specified when creating the invoice through Sellix Developer’s API.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">developer_return_url</p>
                          <p>string</p>
                        </td>
                        <td>Can be NULL, return url specified when creating the invoice through Sellix Developer’s API.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">status</p>
                          <p>int</p>
                        </td>
                        <td>Invoice’s status, see more info about statuses below.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">discount</p>
                          <p>float</p>
                        </td>
                        <td>If a coupon was applied, display how much was the discount.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">fee_fixed</p>
                          <p>float</p>
                        </td>
                        <td>How much was taken into fees.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">fee_percentage</p>
                          <p>float</p>
                        </td>
                        <td>How much was taken into percentage fees.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">day_value</p>
                          <p>int</p>
                        </td>
                        <td>Used for analytics purpose, day of invoice creation.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">day</p>
                          <p>string</p>
                        </td>
                        <td>Used for analytics purpose, string value of the day of invoice creation.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">month</p>
                          <p>string</p>
                        </td>
                        <td>Used for analytics purpose, month of invoice creation.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">year</p>
                          <p>int</p>
                        </td>
                        <td>Used for analytics purpose, year of invoice creation.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">created_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>The date and time that the resource was created.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">updated_at</p>
                          <p>timestamp</p>
                        </td>
                        <td>The date and time that the resource was last updated. If never updated, it will be 0.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">serials</p>
                          <p>array</p>
                        </td>
                        <td>Can be EMPTY, list of serials linked with this invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">file</p>
                          <p>object</p>
                        </td>
                        <td>Can be NULL, info of the file linked with this invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">webhooks</p>
                          <p>array</p>
                        </td>
                        <td>Can be EMPTY, list of webhooks sent for this invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_payout</p>
                          <p>bool</p>
                        </td>
                        <td>If true, the seller cut has been sent (you have received your money.).</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_payout_transaction</p>
                          <p>object</p>
                        </td>
                        <td>Can be NULL, contains info about the payout transaction.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">crypto_transactions</p>
                          <p>array</p>
                        </td>
                        <td>Can be EMPTY, list of all the crypto transactions for this invoice.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">stripe_user_id</p>
                          <p>string</p>
                        </td>
                        <td>User’s stripe id used to create the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">stripe_publishable_key</p>
                          <p>string</p>
                        </td>
                        <td>User’s stripe publishable key used to create the order.</td>
                      </tr>
                      <tr>
                        <td>
                          <p className="param">product</p>
                          <p>object</p>
                        </td>
                        <td>Contains the full product object for this feedback.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>STATUSES</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`0: PENDING
1: COMPLETED
2: CANCELLED
3: WAITING FOR CONFIRMATIONS
4: PARTIAL`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>THE ORDER OBJECT</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "id": 0,
    "uniqid": "demo-c8cee7cfa1",
    "total": 1.00,
    "total_display": 1.00,
    "currency": "USD",
    "user_id": 0,
    "username": "demo",
    "customer_email": "demo@gmail.com",
    "product_id": "demo8d66e",
    "product_type": "serials",
    "product_price": 0.50,
    "file_attachment_uniqid": null,
    "gateway": "stripe",
    "paypal_email": null,
    "paypal_tx_id": null,
    "paypal_payer_email": null,
    "skrill_email": null,
    "skrill_sid": null,
    "skrill_link": null,
    "stripe_id": "demoMhCpr",
    "stripe_client_secret": "demoJFSMHruJ5qL8",
    "perfectmoney_id": null,
    "crypto_address": null,
    "crypto_amount": 0,
    "crypto_received": 0,
    "crypto_uri": null,
    "crypto_confirmations": 1,
    "country": "IT",
    "location": "Italy, Europe",
    "ip": "1.2.3.4",
    "is_vpn_or_proxy": false,
    "user_agent": "PostmanRuntime/7.6.0",
    "quantity": 2,
    "coupon_id": null,
    "custom_fields": {
        "Discord": "demo@gmail.com"
    },
    "developer_invoice": false,
    "developer_title": null,
    "developer_webhook": null,
    "developer_return_url": null,
    "status": 1,
    "discount": 0,
    "fee_fixed": 0,
    "fee_percentage": 0,
    "day_value": 23,
    "day": "Thu",
    "month": "Apr",
    "year": 2020,
    "created_at": 1587656376,
    "updated_at": 1587656403,
    "serials": [
        "demo"
    ],
    "file": {
        "id": 0,
        "uniqid": "demo98agy",
        "storage": "products",
        "name": "demo",
        "original_name": "originaldemo.jpg",
        "extension": "jpg",
        "user_id": 0,
        "size": 1000,
        "created_at": 1587656403
    },
    "webhooks": [
        {
            "uniqid": "demo81e98f",
            "url": "https://demo.sellix.io/api/v1/webhook",
            "event": "order:created",
            "retries": 0,
            "response_code": 200,
            "created_at": 1587656376
        }
    ],
    "crypto_payout": true,
    "crypto_payout_transaction": {
        "to_address" : "demotoaddress98uao8g9pan",
        "from_address" : "demofromaddress98uao8g9pan",
        "crypto_amount" : 0.001234,
        "hash" : "demohash98yno8angs78aygn",
        "created_at" : 1587656376
    },
    "crypto_transactions": [
        {
            "crypto_amount": 0.009876,
            "hash": "demohash09889adn78a",
            "confirmations": 2,
            "created_at": 1587656376,
            "updated_at": 1587656403
        }
    ],
    "stripe_user_id": "demojCKqXa0g",
    "stripe_publishable_key": "demoNU7ojI00sqQQjLGV",
    "product": {
        ...
    }
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="get-order">
                <div className="d-ins">
                  <h3><b>Get an Order</b></h3>
                  <p>
                    <span className="required">GET</span> /order/:uniqid <br />
                    Retrieves an Order by Uniqid.
                  </p>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "order": {
            "id": 0,
            "uniqid": "demo-c8cee7cfa1",
            "total": 1.00,
            "total_display": 1.00,
            "currency": "USD",
            "user_id": 0,
            "username": "demo",
            "customer_email": "demo@gmail.com",
            "product_id": "demo8d66e",
            "product_type": "serials",
            "product_price": 0.50,
            "file_attachment_uniqid": null,
            "gateway": "stripe",
            "paypal_email": null,
            "paypal_tx_id": null,
            "paypal_payer_email": null,
            "skrill_email": null,
            "skrill_sid": null,
            "skrill_link": null,
            "stripe_id": "demoMhCpr",
            "stripe_client_secret": "demoJFSMHruJ5qL8",
            "perfectmoney_id": null,
            "crypto_address": null,
            "crypto_amount": 0,
            "crypto_received": 0,
            "crypto_uri": null,
            "crypto_confirmations": 1,
            "country": "IT",
            "location": "Italy, Europe",
            "ip": "1.2.3.4",
            "is_vpn_or_proxy": false,
            "user_agent": "PostmanRuntime/7.6.0",
            "quantity": 2,
            "coupon_id": null,
            "custom_fields": {},
            "developer_invoice": false,
            "developer_title": null,
            "developer_webhook": null,
            "developer_return_url": null,
            "status": 1,
            "discount": 0,
            "fee_fixed": 0,
            "fee_percentage": 0,
            "day_value": 23,
            "day": "Thu",
            "month": "Apr",
            "year": 2020,
            "created_at": 1587656376,
            "updated_at": 1587656403,
            "serials": [],
            "file": null,
            "webhooks": [],
            "crypto_payout": true,
            "crypto_payout_transaction": null,
            "crypto_transactions": [],
            "stripe_user_id": "demojCKqXa0g",
            "stripe_publishable_key": "demoNU7ojI00sqQQjLGV",
            "product": {
                ...
            }
        }
    },
    "message": null,
    "log": null,
    "error": null,
    "env": "production"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="list-order">
                <div className="d-ins">
                  <h3><b>List All Orders</b></h3>
                  <p>
                    <span className="required">GET</span> /order <br />
                    Returns a list of all the Order. The order are sorted by creation date, with the most recently created order being first. <br />
                    Product objects and additional info are not shown in the list endpoint.
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="param">page</p>
                          <p>integer</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-ex">
                  <div className="code-block response">
                    <div className="code-block-header">
                      <p>RESPONSE</p>
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
    "status": 200,
    "data": {
        "orders": [
            {
                "id": 0,
                "uniqid": "demo-c8cee7cfa1",
                "total": 1.00,
                "total_display": 1.00,
                "currency": "USD",
                "user_id": 0,
                "username": "demo",
                "customer_email": "demo@gmail.com",
                "product_id": "demo8d66e",
                "product_type": "serials",
                "product_price": 0.50,
                "file_attachment_uniqid": null,
                "gateway": "stripe",
                "paypal_email": null,
                "paypal_tx_id": null,
                "paypal_payer_email": null,
                "skrill_email": null,
                "skrill_sid": null,
                "skrill_link": null,
                "stripe_id": "demoMhCpr",
                "stripe_client_secret": "demoJFSMHruJ5qL8",
                "perfectmoney_id": null,
                "crypto_address": null,
                "crypto_amount": 0,
                "crypto_received": 0,
                "crypto_uri": null,
                "crypto_confirmations": 1,
                "country": "IT",
                "location": "Italy, Europe",
                "ip": "1.2.3.4",
                "is_vpn_or_proxy": false,
                "user_agent": "PostmanRuntime/7.6.0",
                "quantity": 2,
                "coupon_id": null,
                "custom_fields": {},
                "developer_invoice": false,
                "developer_title": null,
                "developer_webhook": null,
                "developer_return_url": null,
                "status": 1,
                "discount": 0,
                "fee_fixed": 0,
                "fee_percentage": 0,
                "day_value": 23,
                "day": "Thu",
                "month": "Apr",
                "year": 2020,
                "created_at": 1587656376,
                "updated_at": 1587656403,
                "serials": [],
                "file": null,
                "webhooks": [],
                "crypto_payout": true,
                "crypto_payout_transaction": null,
                "crypto_transactions": [],
                    "stripe_user_id": "demojCKqXa0g",
                    "stripe_publishable_key": "demoNU7ojI00sqQQjLGV",
                    "product": {
                        ...
                    }
                }
            ]
        },
        "message": null,
        "log": null,
        "error": null,
        "env": "production"
    }
    ...`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
            </Container>
          </div>          
        </div>        
      </div>
    );
  }
}

export default Documentation;
