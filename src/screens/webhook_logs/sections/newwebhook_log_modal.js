import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Button,
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
import _ from 'lodash'

import { DateRangePicker2 } from 'components'

import { Formik } from 'formik';
import * as Yup from "yup";

const EVENT_OPTIONS = [
    { value: 'order:created', label: 'order:created' },
    { value: 'order:updated', label: 'order:updated' },
    { value: 'order:partial', label: 'order:partial' },
    { value: 'order:paid', label: 'order:paid' },
    { value: 'order:cancelled', label: 'order:cancelled' },
    { value: 'product:created', label: 'product:created' },
    { value: 'product:edited', label: 'product:edited' },
    { value: 'product:stock', label: 'product:stock' },
    { value: 'query:created', label: 'query:created' },
    { value: 'query:replied', label: 'query:replied' },
    { value: 'feedback:received', label: 'feedback:received' }
]


class NewWebhookLogModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initialValues: {
        url: '',
        event: '',
        key: ''
      },
    }
  }

  handleSubmit(values) {
    this.props.actions.createWebhookSimulator(values).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message || 'Created successfully');
      this.props.actions.getWebhookLogList();
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
    })
    this.props.closeModal()
  }

  render() {    
    const { openModal, closeModal } = this.props
    const { 
      loading,
      initialValues,
    } = this.state


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
                event: Yup.string().required('Event is required'),
                key: Yup.string(),
            })}>
            {props => (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>                
                <ModalHeader toggle={closeModal}>
                  Webhook Simulator
                </ModalHeader>
                <ModalBody className="p-4">
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="url">URL</Label>
                        <Input 
                          id="url"
                          type="text" placeholder="URL"
                          value={props.values.url}
                          onChange={props.handleChange}
                          className={
                            props.errors.url && props.touched.url
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.url && props.touched.url && (
                          <div className="invalid-feedback">{props.errors.url}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="event">Events</Label>
                        <Select 
                          id="event"
                          placeholder="Select events" 
                          options={EVENT_OPTIONS}
                          searchable={false}                              
                          value={props.values.event}
                          onChange={(option) => {
                            props.handleChange("event")(option.value);
                          }}
                          className={
                            props.errors.event && props.touched.event
                              ? "is-invalid"
                              : ""
                          }>
                        </Select>
                        {props.errors.event && props.touched.event && (
                          <div className="invalid-feedback">{props.errors.event}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="key">Key</Label>
                        <Input 
                          id="key"
                          type="text" placeholder="Key"
                          value={props.values.key}
                          onChange={props.handleChange}
                          className={
                            props.errors.key && props.touched.key
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.key && props.touched.key && (
                          <div className="invalid-feedback">{props.errors.key}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="justify-content-start">
                  <Button color="primary" type="submit" className="mr-2">Simulate</Button>
                </ModalFooter>                
              </Form>
              )}
            </Formik>
          </Modal>
        </div>
    )
  }
}

export default NewWebhookLogModal