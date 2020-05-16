import React from 'react'
import { Col, FormGroup, Label, Input, Form, Row } from 'reactstrap'
import { Button } from 'components'
import { Formik } from "formik";
import map from "lodash/map"

import './style.scss';


const generateSettings = (settings, type) => {
  let {
    change_address_bitcoin,
    fee_fixed_bitcoin,
    site_address_bitcoin,
    change_address_litecoin,
    fee_fixed_litecoin,
    site_address_litecoin,
    fee_fixed_ethereum,
    site_address_ethereum,
    transaction_fee_ethereum,
    fee_fixed_bitcoincash,
    site_address_bitcoincash,
    fee_percentage,
    file_upload_maximum_size,
    main_directory,
    transaction_expire,
    email_validation_required
  } = settings;

  return {
    bitcoin: {
      change_address_bitcoin,
      fee_fixed_bitcoin,
      site_address_bitcoin
    },
    litecoin: {
      change_address_litecoin,
      fee_fixed_litecoin,
      site_address_litecoin,
    },
    ethereum: {
      fee_fixed_ethereum,
      site_address_ethereum,
      transaction_fee_ethereum,
    },
    bitcoincash: {
      fee_fixed_bitcoincash,
      site_address_bitcoincash,
    },
    general: {
      fee_percentage,
      file_upload_maximum_size,
      main_directory,
      transaction_expire,
      email_validation_required,
    }
  }[type]
}

const Settings = ({ type, title, handleSubmit, settings }) => {

    const current = generateSettings(settings, type)

    return (
        <Formik initialValues={current} enableReinitialize={true} onSubmit={handleSubmit}>
          {(form) => (
              <Form onSubmit={form.handleSubmit}>
                  <FormGroup>
                    {<h4 className="mb-4">{title}</h4>}
                  </FormGroup>

                  <Row>
                    <Col lg={12} >
                      {
                        map(current, (value, key) => {
                          if(key === "email_validation_required") {
                            return <FormGroup check className="mb-3 pl-0" key={key}>
                              <div className="custom-checkbox custom-control">
                                <Input
                                    className="custom-control-input"
                                    type="checkbox"
                                    id="email_validation_required"
                                    name="email_validation_required"
                                    onChange={(e) => form.handleChange('email_validation_required')(e.target.checked)}
                                    checked={form.values.email_validation_required ? form.values.email_validation_required !== "0" : false}
                                />
                                <Label className="custom-control-label"  htmlFor="email_validation_required" check>
                                  Email Validation Required
                                </Label>
                              </div>
                            </FormGroup>
                          } else if (key !== 'id') {
                            return <FormGroup className="mb-4" key={key}>
                              <Label htmlFor={key} style={{ textTransform: "capitalize" }}>{key.replaceAll("_", " ")}</Label>
                              <Input
                                  type="text"
                                  id={key}
                                  name={key}
                                  placeholder={key.replaceAll("_", " ")}
                                  onChange={form.handleChange}
                                  value={form.values[key]}
                              />
                            </FormGroup>
                          }
                        })
                      }

                    </Col>
                  </Row>

                  <Col lg={12} className={"mt-4 p-0 position-absolute"} style={{ bottom: "-6rem" }}>
                    <Button color="primary" type="submit" style={{width: 200}}>
                      Save Settings
                    </Button>
                  </Col>
              </Form>
          )}
        </Formik>
    )
}

export default Settings
