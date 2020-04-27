import React from 'react'
import {
  Form,
  Modal,
  ModalHeader, 
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { Button } from 'components';

import QRCode from 'react-qr-code';
import { Formik } from 'formik';
import * as Yup from "yup";

class TwoFactorModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }

    this.wareHouseHandleSubmit = this.wareHouseHandleSubmit.bind(this)
  }

  // Create or Contact
  wareHouseHandleSubmit(data) {
    this.props.closeModal()
  }

  render() {
    const { openModal, closeModal } = this.props

    return (
      <div className="">
        <Modal isOpen={openModal}
          className="modal-success newmember-modal"
          >
          <Formik
            initialValues={this.state.initWareHouseValue}
            onSubmit={(values, {resetForm}) => {
              this.wareHouseHandleSubmit(values)
              resetForm(this.state.initWareHouseValue)
            }}
            validationSchema={Yup.object().shape({
                warehouseName: Yup.string()
                    .required('Warehouse Name is a required field'),
            })}>
            {props => (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>
                <ModalHeader toggle={closeModal}>Enable Two-Factor Authentication</ModalHeader>
                  <ModalBody className="text-center">
                    <QRCode value="hey" />,
                  </ModalBody>
                  <ModalFooter className="justify-content-start">
                    <Button color="primary" type="submit" className="mr-2">Next</Button>
                  </ModalFooter>
              </Form>
              )}
            </Formik>
          </Modal>
        </div>
    )
  }
}

export default TwoFactorModal