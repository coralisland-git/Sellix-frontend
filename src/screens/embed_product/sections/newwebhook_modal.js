import React from 'react'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader, 
  ModalBody,
} from 'components/reactstrap'
import Select from 'react-select'
import { Button } from 'components';
import { Formik } from 'formik';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light'
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'

import Clipboard from 'react-clipboard.js';
import object from "yup/lib/object";
import string from "yup/lib/string";

SyntaxHighlighter.registerLanguage('javascript', javascript)


const Yup = {
  object,
  string
}
class NewCustomModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,      
      initialValues: {        
        product: '',
      }
    }
  }

  handleSubmit(values) {
    this.props.closeModal();
  }

  render() {    
    const { openModal,
      closeModal,
      theme, 
      codeStyle,
      all_products, 
      custom_fields,
      embedCode,       
      addCustomField,
      deleteCustomField,
      saveCustomField,
      generateCode
    } = this.props
    var { 
      loading,
      initialValues,
    } = this.state

    var PRODUCT_LIST = all_products.map(product => {
      return {
        value: product['title'],
        label: product['title'],
        uniqid: product['uniqid']
      }
    })

    return (      
      <Modal isOpen={openModal}
        className={`modal-success documentation-screen ${theme}`}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            this.handleSubmit(values)
          }}
          validationSchema={Yup.object().shape({
          })}>
          {props => (
            <Form name="simpleForm" onSubmit={props.handleSubmit}>
              <ModalHeader toggle={closeModal}>
                Generate Code
              </ModalHeader>
              <ModalBody className="p-4 embed">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="event">Product</Label>
                      <Select 
                        id="event"
                        placeholder="Select product" 
                        options={PRODUCT_LIST}
                        classNamePrefix={"react-select"}
                        isSearchable={false}
                        value={props.values.product}
                        onChange={(option) => {
                          props.handleChange("product")(option);
                          generateCode(option, custom_fields)
                        }}
                        className={
                          props.errors.product && props.touched.product
                            ? "is-invalid"
                            : ""
                        }>
                      </Select>
                      {props.errors.product && props.touched.product && (
                        <div className="invalid-feedback">{props.errors.product}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <FormGroup className="d-flex justify-content-start">
                      <Label htmlFor="custom fields">Custom fields</Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {
                    custom_fields.map((field, index) => {
                      return(
                        <Col lg={12} key={index}>
                          <Row className="custom-field">
                            <Col lg={5}>
                              <FormGroup className="mb-3">
                                <Input type="text" value={field.name} 
                                  placeholder="Field name"
                                  onChange={(e) => {
                                  saveCustomField("name", e.target.value, props.values.product, index)
                                }}/>
                              </FormGroup>
                            </Col>
                            <Col lg={5}>
                              <FormGroup className="mb-3">
                                <Input type="text" value={field.value} 
                                  placeholder="Value"
                                  onChange={(e) => {
                                  saveCustomField("value", e.target.value, props.values.product, index)
                                }}/>
                              </FormGroup>
                            </Col>
                            <Col lg={2}>
                              <FormGroup className="mb-3">
                                <div className="d-flex align-items-center mt-3">
                                  <a onClick={(e) => deleteCustomField(e, props.values.product, index)}
                                    className="cursor-pointer" 
                                    style={{fontSize: 16}}>
                                    <i className="fas fa-trash"/>
                                  </a>
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      )
                    })
                  }                    
                </Row>
                <Row>
                  <Col lg={12}>
                    <FormGroup className="d-flex justify-content-end">
                      <Button color="default" onClick={addCustomField}>Add Field</Button>
                    </FormGroup>
                  </Col>
                </Row>
                { props.values.product && embedCode && (
                    <Row>
                      <Col lg={12}>
                        <FormGroup className="mb-0">
                          <div className="code-block response mb-0">
                            <div className="code-block-header">
                              <p>{props.values.product.label} Embed Code</p>
                              <Clipboard 
                              data-clipboard-text={embedCode} 
                              button-title="Copy">
                                <i className="fa fa-clone" aria-hidden="true" />
                              </Clipboard>
                            </div>
                            <SyntaxHighlighter language="html" style={codeStyle} showLineNumbers={true}>
                              {embedCode}
                            </SyntaxHighlighter>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                )}
              </ModalBody>
              {/*<ModalFooter className="justify-content-start">
                 <Button color="primary" type="submit" className="mr-2">Ok</Button>
               </ModalFooter>*/}
            </Form>
            )}
          </Formik>
        </Modal>
    )
  }
}

export default NewCustomModal