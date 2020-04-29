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
  ModalFooter,
} from 'reactstrap'
import Select from 'react-select'
import { Button } from 'components';
import { Formik } from 'formik';
import * as Yup from "yup";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Clipboard from 'react-clipboard.js';


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
    var temp = []
    var custom_fields = this.props.custom_fields.map(field => {
      if(field.name !== "" && field.value !== "" && temp.indexOf(field.name) == -1 ){
        temp.push(field.name)
        return `data-sellix-custom-${field.name.toLowerCase()}="${field.value}"`
      }
    })
    custom_fields = custom_fields.filter(field => {
      if (field !== "")
        return field
    })
    var generateCode = `<button
  data-sellix-product="${values.product.uniqid}"`
    if (custom_fields.length > 0)
      generateCode += '\n  ' + custom_fields.join('\n  ')
    generateCode += `
  type="submit"
  alt="Buy Now with Sellix.io"
>
  Purchase
</button>`    
    this.props.showGenerateCode(generateCode)
  }

  render() {    
    const { openModal, 
      closeModal, 
      all_products, 
      custom_fields,
      generateCode,       
      addCustomField,
      deleteCustomField,
      saveCustomField
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
        className="modal-success documentation-screen">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            this.handleSubmit(values)
          }}
          validationSchema={Yup.object().shape({                
            product: Yup.string().required('Events is required')                
          })}>
          {props => (
            <Form name="simpleForm" onSubmit={props.handleSubmit}>                
              <ModalHeader toggle={closeModal}>
                Generate Code
              </ModalHeader>
              <ModalBody className="p-4">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="event">Product</Label>
                      <Select 
                        id="event"
                        placeholder="Select product" 
                        options={PRODUCT_LIST}
                        searchable={false}
                        value={props.values.product}
                        onChange={(option) => {
                          props.handleChange("product")(option);
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
                                  saveCustomField("name", e.target.value, index)
                                }}/>
                              </FormGroup>
                            </Col>
                            <Col lg={5}>
                              <FormGroup className="mb-3">
                                <Input type="text" value={field.value} 
                                  placeholder="Value"
                                  onChange={(e) => {
                                  saveCustomField("value", e.target.value, index)
                                }}/>
                              </FormGroup>
                            </Col>
                            <Col lg={2}>
                              <FormGroup className="mb-3">
                                <div className="d-flex align-items-center mt-3">
                                  <a onClick={(e) => deleteCustomField(e, index)}
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
                { generateCode && (
                    <Row>
                      <Col lg={12}>
                        <FormGroup>
                          <div className="code-block response mb-0">
                            <div className="code-block-header">
                              <p>{props.values.product.label} Embed Code</p>
                              <Clipboard 
                              data-clipboard-text={generateCode} 
                              button-title="Copy">
                                <i className="fa fa-clone" aria-hidden="true"></i>
                              </Clipboard>
                            </div>
                            <SyntaxHighlighter language="html" style={atomOneLight} showLineNumbers={true}>
                              {generateCode}
                            </SyntaxHighlighter>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                )}
              </ModalBody>
              <ModalFooter className="justify-content-start">
                <Button color="primary" type="submit" className="mr-2">Generate</Button>
              </ModalFooter>                
            </Form>
            )}
          </Formik>
        </Modal>
    )
  }
}

export default NewCustomModal