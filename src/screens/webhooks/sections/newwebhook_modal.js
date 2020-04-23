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
    var action = this.props.actions.createWebhook;
    var msg = 'Created successfully'
    if(values['uniqid']){
      action = this.props.actions.editWebhook;
      msg = 'Updated successfully'
    }
    action(values).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message || msg);
      this.props.actions.getWebhookList();
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
    })
    this.props.closeModal()
  }

  render() {    
    const { openModal, closeModal, webhook, chosenEvents, updateEvents } = this.props
    var { 
      loading,
      initialValues,
    } = this.state

    if (webhook){
      initialValues = {
        uniqid: webhook['uniqid'],
        url: webhook['url'],
        events: webhook['events']
      }      
    }

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
                events: Yup.string().required('Events is required')                
            })}>
            {props => (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>                
                <ModalHeader toggle={closeModal}>
                  Webhook Endpoint
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
                          placeholder="Select events" 
                          options={EVENT_OPTIONS}
                          searchable={false}
                          onChange={(option) => {
                            var evts = chosenEvents
                            evts.push(option.value);
                            updateEvents(evts);
                            props.handleChange("events")(chosenEvents.join(','));
                          }}
                          className={
                            props.errors.events && props.touched.events
                              ? "is-invalid"
                              : ""
                          }>
                        </Select>
                        {props.errors.events && props.touched.events && (
                          <div className="invalid-feedback">{props.errors.events}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="event">{chosenEvents.length} events</Label>
                        <ul className="chosen-events">
                          { chosenEvents.map((event, index) => {
                            return(
                              <li key={index} className="d-flex pt-1 pb-1">
                                <span className="mr-2">{event}</span>
                                <i className="fa fa-times cursor-pointer" 
                                  onClick={ () => {
                                    var evts = chosenEvents.filter(et => {
                                      if (et == event)
                                        return false
                                      return true
                                    });
                                    updateEvents(evts);
                                    props.handleChange("events")(evts.join(','));
                                  }}>
                                </i>
                              </li>
                            )
                          })}
                        </ul>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="justify-content-start">
                  <Button color="primary" type="submit" className="mr-2">{ props.values.uniqid? "Update" : "Add" } Webhook Endpoint</Button>
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