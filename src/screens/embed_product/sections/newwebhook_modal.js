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


class NewWebhookModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,      
      initialValues: {
        url: '',
        events: ''        
      },
    }
  }

  handleSubmit(values) {
        
  }

  render() {    
    const { openModal, closeModal, all_products } = this.props
    var { 
      loading,
      initialValues,
    } = this.state

    var PRODUCT_LIST = all_products.map(product => {
      return {
        value: product['title'],
        label: product['title'],
        id: product['id']
      }
    })

    return (
      <div>
        <Modal isOpen={openModal}
          className="modal-success">
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}
            validationSchema={Yup.object().shape({
                url: Yup.string().required('URL is required'),
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
                    <Col>
                      <FormGroup>
                        <Label htmlFor="custom fields">Custom fields</Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="justify-content-start">
                  <Button color="primary" type="submit" className="mr-2">Generate</Button>
                </ModalFooter>                
              </Form>
              )}
            </Formik>
          </Modal>
        </div>
    )
  }
}

export default NewWebhookModal