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
  { key: 'blacklist-object', value: 'Blacklist Object' },    
  { key: 'get-blacklist', value: 'Get Blacklist' },
  { key: 'list-blacklist', value: 'List Blacklist' },
  { key: 'create-blacklist', value: 'Create a Blacklist' },
  { key: 'update-blacklist', value: 'Update a Blacklist' },
  { key: 'destroy-blacklist', value: 'Destroy a Blacklist' }
]

const userId = window.localStorage.getItem('userId')

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

  componentDidMount() {
    var key = this.props.history.location.hash.substr(1);    
    if (key !== "")
      this.setState({initial : true})
  }
   
  render() {   

    var items = ['get_started'];
    NAVITATIONS.map((nav => {
        items.push(nav.key)
    }))

    items.push('api_reference');
    items.push('blacklist');

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
                    (el) => {                      
                      if((el.id !== "introduction" && !this.state.initial) || !this.state.initial){
                        this.props.history.push(`/documentation#${el.id}`)
                      }
                      else
                        this.setState({initial: false})
                    }
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
                  <li><a href="/documentation#blacklist" >Black list</a></li>
                  {
                     API_NAVIGATIONS.map((child, cindex) => {
                       return (
                         <li className="sub-nav" key={cindex}>
                           <a 
                             href={`/documentation#${child.key}`} 
                           >{child.value}</a>
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
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
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

                    Your API key can be accessed and re-generated <a href={`https://sellix.io/settings/${userId}/security`}>here</a> in the security tab. <br /><br />

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
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
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
                      <tr>
                        <td>
                          <p className="param">[remove per_page text]</p>
                          <p></p>
                        </td>
                        <td>                          
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
                    <SyntaxHighlighter language="php" style={sunburst} showLineNumbers={true}>
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
                    with <a href={`https://sellix.io/dashboard/${userId}/developer/webhooks/all`}>Webhook Endpoints</a>, 
                    alongside Product/Payment Order status webhooks and Dynamic Product webhooks. <br /><br />
                    Please note <b>only HTTPS webhook URLs are supported</b>.<br /><br />
                    A webhook simulator is available allowing you to simulate webhooks to a URL. It can be 
                    accessed <a href={`https://sellix.io/dashboard/${userId}/developer/webhooks/logs`}>here</a>.<br /><br />
                  </p>
                  <p><b>Signing/Validating</b></p>
                  <p>
                    To verify the authenticity of a webhook request and its payload, each webhook request includes 
                    a <span className="badge-mark">X-Sellix-Signature</span> header with a 
                    HMAC signature comprised of the JSON encoded request body and your webhook secret. 
                    Your webhook secret can be changed in your <a href={`https://sellix.io/settings/${userId}/security`}>settings page</a>. <br /><br />
                  </p>
                  <p><b>Events</b></p>
                  <p>
                    Each webhook request will feature a <span className="badge-mark">X-Sellix-Event</span> header containing the 
                    webhook event type. A list of supported events from <a href={`https://sellix.io/dashboard/${userId}/developer/webhooks/all`}>Webhook Endpoints</a> can be found below.
                  </p>
                  <table className="border-table">
                    <thead>
                      <tr>
                        <th className="table-title">EVENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge-mark">order:created</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:updated</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:partial</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:paid</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:paid:product</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:cancelled</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">product:created</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">product:stock</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">product:edited</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">query:created</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">query:replied</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark"> feedback:received</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    <br /><br /><b>Logs</b>
                  </p>
                  <p>
                    Each webhook request will create a <a href="#">Webhook Log</a>. The object is created by the request 
                    has been sent. Before the request response has actually been received, the <span className="badge-mark">response_code</span> will 
                    be <span className="badge-mark">0</span>, indicating it is pending.<br /><br />
                    Each webhook request will also include a <span className="badge-mark">X-Sellix-Webhook</span> request header 
                    containing the <a href="#">Webhook Log</a> <span className="badge-mark">id</span>.
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
              <section id="blacklist">
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
              <section id="blacklist-object">
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
                  <p><b>Argument</b></p>
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
}
`}
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
                  <p><b>Argument</b></p>
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
            </Container>  
          </div>          
        </div>        
      </div>
    );
  }
}

export default Documentation;
