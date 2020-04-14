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
import { Alert } from 'reactstrap'
import { Spin } from 'components'
import QRCode from 'react-qr-code';
import { Formik } from 'formik';
import * as Yup from "yup";
import {
  CommonActions,
  AuthActions
} from 'services/global'

import * as Actions from '../../../actions'


const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(Actions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class ProcessOrderModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      email: ''
    }
  }

  processOrder(){
    this.setState({ loading: true })
    this.props.actions.processOrder({
      uniqid: this.props.invoiceId,
      processing: true,
      payout: true
    }).then(res => {
      if(res.status == 200){
        this.props.commonActions.tostifyAlert('success', res.message)
        this.props.closeModal()
      } else throw res
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    const { openModal, closeModal, invoiceId } = this.props
    const { loading } = this.state

    return (
      <div className="">
        <Modal isOpen={openModal}
          className="modal-success"
          >
          <ModalHeader toggle={closeModal}>Process Order</ModalHeader>
            <ModalBody>
                <div>
                    <p className="text-left" style={{lineHeight: '1.4em'}}>
                    This invoice <b>{invoiceId}</b> has been flagged as a partial payment. 
                    If you wish to, you can process this order now. 
                    You won’t receive any further revenue besides what you already received now.
                    </p>
                </div>
                
                <Button color="primary" onClick={this.processOrder.bind(this)} className="mr-2 mt-4 mb-4" disabled={loading}>
                {loading?<Spin/>:'Process Order'}
                </Button>
            </ModalBody>
          </Modal>
        </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessOrderModal)