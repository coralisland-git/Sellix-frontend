import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'components';
import {
  Modal,
  ModalHeader, 
  ModalBody
} from 'components/reactstrap'
import { Spin } from 'components'
import { CommonActions } from 'services/global'
import config from "constants/config"
import * as Actions from '../../../actions'


class ProcessOrderModal extends Component {
  
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
        this.props.refreshOrder()
        this.props.closeModal()
      } else throw res
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    const { openModal, closeModal, invoiceId, status } = this.props
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
                    This invoice <b>{invoiceId}</b> has been flagged as a {config.ORDER_STATUS[status]} payment.
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


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
})

export default connect(null, mapDispatchToProps)(ProcessOrderModal)