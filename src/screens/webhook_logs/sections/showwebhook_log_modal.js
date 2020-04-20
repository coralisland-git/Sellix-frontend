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
import moment from 'moment'

import { DateRangePicker2 } from 'components'

import { Formik } from 'formik';
import * as Yup from "yup";
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

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


class ShowWebhookLogModal extends React.Component {
  
  constructor(props) {
    super(props)
  }

  render() {    
    const { openModal, closeModal, webhook } = this.props
    console.log('~~~~~~~~~~~~~~~', webhook)    
    var payload = {}
    if (webhook && webhook['payload'])
      payload = JSON.parse(webhook['payload'])

    return (
      <div>
        <Modal isOpen={openModal}
          className="modal-success">
          <ModalHeader toggle={closeModal}>
            Webhook Simulator
          </ModalHeader>
          <ModalBody className="p-4">
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="url">URL</Label>
                  <p>{webhook['url']}</p>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="event">Event</Label>
                  <p>{webhook['event']}</p>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <p>{webhook['status']}</p>
                </FormGroup>
              </Col>
              <Col lg={4}>
                <FormGroup>
                  <Label htmlFor="status">Attempts</Label>                  
                  <p>{webhook['retries']}</p>
                </FormGroup>
              </Col>
              <Col lg={4}>
                <FormGroup>
                  <Label htmlFor="status">Sent at</Label>
                  <p className="mb-1">{new moment(new Date(webhook['updated_at']*1000)).format('DD, MMM YYYY')}</p>
                  <p>{new moment(new Date(webhook['updated_at']*1000)).format('HH:mm')}</p>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="event">Payload</Label>                  
                  <JSONPretty 
                    id="json-pretty" 
                    data={payload}
                    style={{maxHeight: 360, overflow: "scroll"}}
                  ></JSONPretty>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-start">
            <Button color="primary" 
              type="button" 
              className="mr-2"
              onClick={ () => this.props.closeModal() }
              >OK
            </Button>
          </ModalFooter>     
        </Modal>
      </div>
    )
  }
}

export default ShowWebhookLogModal