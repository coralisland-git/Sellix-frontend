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
        event: ''        
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
    const { openModal, closeModal, chosenEvents, updateEvents } = this.props
    const { 
      loading,      
      initialValues,
    } = this.state

    var event_options = EVENT_OPTIONS.filter(option => {
      for(let i=0; i<chosenEvents.length; i++){        
        if(option['value'] == chosenEvents[i])
          return false
      }
      return true
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
                event: Yup.string().required('Event is required')
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
                        <Label htmlFor="event">Event</Label>
                        <Select 
                          id="event"
                          placeholder="Select event" 
                          options={event_options}
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