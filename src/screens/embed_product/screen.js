import React from "react";
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
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
import { Loader } from 'components'
import sellix_logo from "assets/images/Sellix_logo.svg";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Clipboard from 'react-clipboard.js';
import { NewWebhookModal } from './sections';
import { CommonActions } from 'services/global';
import * as ProductActions from '../product/actions';
import { confirmAlert } from 'react-confirm-alert';

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    all_products: state.product.all_products
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    actions: bindActionCreators(ProductActions, dispatch)    
  })
}


class EmbedProduct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      openModal: false,
    }
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.actions.getProductList().catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Sommthing went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  openNewWebhookModal() {
    this.setState({
      openModal: true      
    })
  }

  closeNewWebhookModal() {
    this.setState({
      openModal: false
    })
  }

  render() {

    const { loading, openModal } = this.state

    return (
      <div className="documentation-screen embed">
        <div className="animated fadeIn">
          <NewWebhookModal 
            openModal={openModal} 
            closeModal={this.closeNewWebhookModal.bind(this)}
            all_products={this.props.all_products}
          />
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Embed Products</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <Button color="primary" onClick={this.openNewWebhookModal.bind(this)}>
                      Generate Code</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                :
                  <Row>
                    <Col lg={12}>
                      <div className="p-5">
                        <p className="page_description text-grey mb-4">
                          We offer the possibility to embed our products directly into your site, without having to rely on our shop page. <br />
                          In order to do this, you first have to include our embed.js through this link
                        </p>
                        <div className="code-block response">
                          <div className="code-block-header">
                            <p>EMBED JAVASCRIPT</p>
                            <Clipboard 
                            data-clipboard-text={'<script type="text/javascript" src="https://cdn.sellix.io/static/js/embed.js"></script>'} 
                            button-title="Copy">
                              <i className="fa fa-clone" aria-hidden="true"></i>
                            </Clipboard>
                          </div>
                          <SyntaxHighlighter language="html" style={atomOneLight} showLineNumbers={true}>
                            {`<script type="text/javascript" src="https://cdn.sellix.io/static/js/embed.js"></script>`}
                          </SyntaxHighlighter>
                        </div>
                        <p className="page_description text-grey mb-4">
                          After adding this, you can then proceed with the button HTML that will activate our payment modal
                        </p>
                        <div className="code-block response">
                          <div className="code-block-header">
                            <p>BASIC BUTTON</p>
                            <Clipboard 
                            data-clipboard-text={`<button
      data-sellix-product=“PRODUCT_UNIQID“
      type="submit"
      alt="Buy Now with Sellix.io"
    >
      Purchase
    </button>`} 
                            button-title="Copy">
                              <i className="fa fa-clone" aria-hidden="true"></i>
                            </Clipboard>
                          </div>
                          <SyntaxHighlighter language="html" style={atomOneLight} showLineNumbers={true}>
                            {`<button
      data-sellix-product=“PRODUCT_UNIQID“
      type="submit"
      alt="Buy Now with Sellix.io"
    >
      Purchase
    </button>`}
                          </SyntaxHighlighter>
                        </div>
                        <p className="page_description text-grey mb-4">
                          Replace <span className="badge-mark">PRODUCT_UNIQID</span> with the uniqid of your product, you can add custom classes to the button. <br /><br />
                          You can also specify custom fields in the button HTML, like this
                        </p>
                        <div className="code-block response">
                          <div className="code-block-header">
                            <p>CUSTOM BUTTON</p>
                            <Clipboard 
                            data-clipboard-text={`<button
      data-sellix-product="PRODUCT_UNIQID"
      data-sellix-custom-reference=“12345678”
      data-sellix-custom-discord=“@Sample#8634”
      type="submit"
      alt="Buy Now with Sellix.io"
    >
      Purchase
    </button>`} 
                            button-title="Copy">
                              <i className="fa fa-clone" aria-hidden="true"></i>
                            </Clipboard>
                          </div>
                          <SyntaxHighlighter language="html" style={atomOneLight} showLineNumbers={true}>
                            {`<button
      data-sellix-product="PRODUCT_UNIQID"
      data-sellix-custom-reference=“12345678”
      data-sellix-custom-discord=“@Sample#8634”
      type="submit"
      alt="Buy Now with Sellix.io"
    >
      Purchase
    </button>`}
                          </SyntaxHighlighter>
                          <Button
                            className="demo-btn"
                            color="primary"
                            data-sellix-product="5ea869ce3e971" 
                            data-sellix-custom-demo="dummy"
                            type="submit"
                            alt="Embed Demo Button"
                          >
                            Demo
                          </Button>
                        </div>
                        <p className="page_description text-grey mb-4">
                          This will add <span className="badge-mark">reference</span> and <span className="badge-mark">discord</span> to the custom fields array of the invoice that will be created. <br />
                          If the product already has custom fields, you can still specify additional ones that will be passed to the invoice. <br />
                          If you specify a custom field that the product already has, the user will not be asked for it when proceeding with the purchase.
                        </p>
                      </div>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbedProduct)
