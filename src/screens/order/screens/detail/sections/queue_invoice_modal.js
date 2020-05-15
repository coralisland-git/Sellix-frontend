import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'components';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Spin } from 'components'
import { CommonActions } from 'services/global'
import config from "constants/config"

import * as Actions from '../../../actions'


class QueueInvoiceModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      email: ''
    }
  }


  queueInvoice = () => {
    this.setState({ loading: true })
    this.props.actions.queueInvoice({
      uniqid: this.props.invoiceId
    })
        .then(res => {
          console.log(res)
          if(res.status == 200){
            this.props.commonActions.tostifyAlert('success', res.message)
            this.props.refreshOrder()
            this.props.closeModal()
          } else {
              throw res
          }
        })
        .catch(err => {
          console.log(err)
          this.props.commonActions.tostifyAlert('error', err.error)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
  }

  render() {
    const { openModal, closeModal, invoiceId, status } = this.props
    const { loading } = this.state

    return (
      <div className="">
        <Modal isOpen={openModal} className="modal-success">
          <ModalHeader toggle={closeModal}>Invoice Queue</ModalHeader>
            <ModalBody>
                <div>
                    <p className="text-left" style={{lineHeight: '1.4em'}}>
                      This invoice <b>{invoiceId}</b> has been flagged as a <strong>{config.ORDER_STATUS[status]}</strong>. <br/><br/>
                      You can queue invoices to be checked again in case one of your customers has sent the payment after the invoice expired.
                    </p>
                </div>
                
                <Button color="primary" onClick={this.queueInvoice} className="mr-2 mt-4 mb-4" disabled={loading}>
                  {loading ? <Spin/> : 'Queue Invoice'}
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

export default connect(null, mapDispatchToProps)(QueueInvoiceModal)