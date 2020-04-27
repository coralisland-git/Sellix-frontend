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
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Scrollspy from 'react-scrollspy'
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

    var items = ['get_started'];
    NAVITATIONS.map(nav => {
        items.push(nav.key)
    })

    items.push('api_reference');
    items.push('blacklist');

    API_NAVIGATIONS.map(nav => {
      items.push(nav.key)
    })

    return (
      <div className="documentation-screen">
        <div className="animated fadeIn">
          <div className="d-wrapper">          
            <div className="side-nav">
              <div className="d-nav">
                <Scrollspy items={ items }
                  className="section-nav"
                  currentClassName="active"
                  onUpdate={
                    (el) => {
                    }
                  }>
                  <div className="field"><span>GET STARTED</span></div>                
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
                  <div className="field"><span>API REFERENCE</span></div>
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`https://sellix.io/api/v2`}
                    </SyntaxHighlighter>                    
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`require 'sellix'
sellix.api_key = 'api key'
sellix.api_email = 'email'`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="pagination">
                <div className="d-ins">
                  <h3><b>Pagination</b></h3>
                  <p>
                    Sellix offers the ability to paginate any list endpoint. The <span class="badge-mark">X-Total-Pages</span> header returns 
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`# Page 10 
Sellix::Orders::List(page: 10)
# Page 10 and 50 per page 
Sellix::Orders::List(page: 10, per_page: 50)`}
                    </SyntaxHighlighter>
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
                    The Sellix API uses the following error codes:
                  </p>
                  <table className="border-table">
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
                  <div className="code-block">
                    <div className="code-block-header">
                      AUTHENTICATION ERROR
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "message": "Unable to authenticate"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      AUTHENTICATION ERROR
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "message": "You are not authorized to perform this action"
}`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      VALIDATION ERROR
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "message": "Validation failed",
  "errors": [
    "Title can't be blank",
    "Title is too short (minimum is 2 characters)",
    "Title must be present"
  ]
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </section>
              <section id="webhooks">
                <div className="d-ins">
                  <h3><b>Webhooks</b></h3>
                  <p>
                    Sellix provides a webhooks system allowing you to subscribe to to events with <a href="#">Webhook Endpoints</a>, 
                    alongside Product/Payment Order status webhooks and Dynamic Product webhooks. <br /><br />
                    Please note <b>only HTTPS webhook URLs are supported</b>.<br /><br />
                    A webhook simulator is available allowing you to simulate webhooks to a URL. It can be accessed <a href="#">here</a>.<br /><br />
                  </p>
                  <p><b>Signing/Validating</b></p>
                  <p>
                    To verify the authenticity of a webhook request and its payload, each webhook request includes 
                    a <span class="badge-mark">X-Sellix-Signature</span> header with a 
                    HMAC signature comprised of the JSON encoded request body and your webhook secret. 
                    Your webhook secret can be changed in your <a href="#">settings page</a>. <br /><br />
                  </p>
                  <p><b>Events</b></p>
                  <p>
                    Each webhook request will feature a <span class="badge-mark">X-Sellix-Event</span> header containing the 
                    webhook event type. A list of supported events from <a href="#">Webhook Endpoints</a> can be found below.
                  </p>
                  <table className="border-table">
                    <tbody>
                      <tr>
                        <td><span className="badge-mark">feedback:updated</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:created</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:updated</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">order:paid</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">product:out_of_stock</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">query:created</span></td>
                      </tr>
                      <tr>
                        <td><span className="badge-mark">query:replied</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    <br /><br /><b>Logs</b>
                  </p>
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`require 'openssl'
require 'active_support'
secret = 'your webhook secret'
signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha512'), secret, payload.to_json)
is_valid_signature = ActiveSupport::SecurityUtils.secure_compare(request.headers['X-Sellix-Signature'], signature)
if is_valid_signature
    # Webhook is valid
end`}
                    </SyntaxHighlighter>
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`GET /api/v2/blacklist/:id
GET /api/v2/blacklist
POST /api/v2/blacklist
PUT /api/v2/blacklist/:id
DELETE /api/v2/blacklist/:id`}
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
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "id": "bGYSEexV",
  "blocked_data": "ZW",
  "blacklist_type": 3,
  "note": "This is a demo blacklist",
  "created_at": "2019-12-28T16:47:01.000+00:00",
  "updated_at": "2019-12-28T16:47:01.000+00:00"
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
                      GET A BLACKLIST
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`Sellix::Blacklist.retrieve('bGYSEexV')`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      RESPONSE
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "id": "bGYSEexV",
  "blocked_data": "ZW",
  "blacklist_type": 3,
  "note": "This is a demo blacklist",
  "created_at": "2019-12-28T16:47:01.000+00:00",
  "updated_at": "2019-12-28T16:47:01.000+00:00"
}`}
                    </SyntaxHighlighter>
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
                      LIST ALL BLACKLIST
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`Sellix::Blacklist.list`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      RESPONSE
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`[
  {
    "id": "bGYSEexV",
    "blocked_data": "ZW",
    "blacklist_type": 3,
    "note": "This is a demo blacklist",
    "created_at": "2019-12-28T16:47:01.000+00:00",
    "updated_at": "2019-12-28T16:47:01.000+00:00"
  }
]`}
                    </SyntaxHighlighter>
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
                      CREATE A BLACKLIST
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`Sellix::Blacklist.create(
    blocked_data: 'ZW',
    blacklist_type: 3
)`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      RESPONSE
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "id": "bGYSEexV",
  "blocked_data": "ZW",
  "blacklist_type": 3,
  "note": "This is a demo blacklist",
  "created_at": "2019-12-28T16:47:01.000+00:00",
  "updated_at": "2019-12-28T16:47:01.000+00:00"
}`}
                    </SyntaxHighlighter>
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
                      UPDATE A BLACKLIST
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`Sellix::Blacklist.update('bGYSEexV',
    blocked_data: 'GR'
)`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      RESPONSE
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`{
  "id": "bGYSEexV",
  "blocked_data": "GR",
  "blacklist_type": 3,
  "note": "This is a demo blacklist",
  "created_at": "2019-12-28T16:47:01.000+00:00",
  "updated_at": "2019-12-28T16:48:02.000+00:00"
}`}
                    </SyntaxHighlighter>
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
                      DESTROY A BLACKLIST
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`Sellix::Blacklist.destroy('bGYSEexV')`}
                    </SyntaxHighlighter>
                  </div>
                  <div className="code-block">
                    <div className="code-block-header">
                      RESPONSE
                    </div>
                    <SyntaxHighlighter language="php" style={atomOneLight}>
                      {`// No Content: 204 HTTP status`}
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
