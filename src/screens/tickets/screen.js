import React from 'react'
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import './style.scss'

import { Formik } from "formik";
import * as Yup from "yup";
import { Loader } from "../../components";
import Select from "react-select";
import axios from 'axios'
import { connect } from 'react-redux'
import { api } from "../../utils";
import Zendesk, { ZendeskAPI } from "react-zendesk";
// import zdApi from '@androozka/zendesk-api-js';

const OPTIONS = [
    { value: 'website_bug', label: 'Website Bug' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'order', label: 'Order' },
    { value: 'payment_issues', label: 'Payment Issue' },
    { value: 'other', label: 'Other' },

]

const ZENDESK_KEY = "fDcM3Ib5ADtloi5i2xHLMsuNvSHnXIOr3z6crmHo";

class Tickets extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    document.title = `Create Ticket | Sellix`;
  }

    handleSubmit = async (data) => {


        const requester = { name: "Victor" };
        const comment = { body: data.message };
        let payload = {
            ticket: {
                requester,
                subject: data.subject,
                comment,
                priority: "urgent",
                custom_fields: [{
                    id: 360006801217,
                    value: data.category
                }]
            }
        };
        const response = await this.sendFeedback(payload, 'sellix');

        console.log(data)
        // console.log(response)
        // console.log(response)
        if (!response.request) {
            this.setState({ isLoading: false, submitError: true });
            return;
        }
    }

    sendFeedback = async (data, subdomain) => {
        try {

            const options = {
                instance: 'sellix', // Zendesk subdomain
                email: 'pavlenkovictor92@gmail.com', // User account to perform requests
                password: '', // Password for user account
                token: ZENDESK_KEY // Generated Zendesk token
            };



            const encoded = btoa(`${options.email}/token:${options.token}`);


            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Basic ${encoded}`
            };
            const response = await axios.post(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, JSON.stringify(data), {
                headers
            });
            const responseData = await response.json();

            console.log(response)
            return responseData;

        } catch (error) {
            console.log(error)
            return error;
        }
    };


  render() {


      const options = {
          instance: 'sellix', // Zendesk subdomain
          email: 'pavlenkovictor92@gmail.com', // User account to perform requests
          password: '', // Password for user account
          token: ZENDESK_KEY // Generated Zendesk token
      };



      const encoded = btoa(`${options.email}/token:${options.token}`);

      console.log(encoded)
      const headers = {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encoded}`
      };

      // Load entire library
      // const { support, sunshine } = zdApi.init(options);

// Load entire API
//       const { tickets, groups } = zdApi.support.init(options);

// Load specific endpoint
//       const { list, create } = zdApi.support.tickets(options);

      // console.log(list)
    let loading = false;
    let validationSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('The message fields is required')
    });


      return (
      <div className="fees-screen">
        <div className="animated fadeIn">
          <div className="section text-center " style={{paddingTop: 100, paddingBottom: 50}}>
            <Container className="home-container" fluid>
              <h3>Create a Tickets</h3>
            </Container>
          </div>
            <Zendesk zendeskKey={ZENDESK_KEY} onLoaded={() => {
                console.log(1)
            }}/>

          <div className="section text-center bg-white" style={{paddingBottom:50}}>
              <Container className="home-container">
                  <Formik initialValues={{}} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
                      {({ handleSubmit, values, errors, handleChange, touched}) => (
                          <Form onSubmit={handleSubmit}>
                              <Card>

                                  <CardBody className="p-4 mb-5 ">
                                      {
                                          loading ?
                                              <Row>
                                                  <Col lg={12}>
                                                      <Loader />
                                                  </Col>
                                              </Row>
                                              :
                                              <Row className="mb-4">
                                                  <Col lg={12}>
                                                      <Row className={'justify-content-center'}>
                                                          <Col lg={8}>
                                                              <FormGroup className="mb-3">
                                                                  <Label htmlFor="category">Category</Label>
                                                                  <Select
                                                                      options={OPTIONS}
                                                                      id="category"
                                                                      value={values.category}
                                                                      searchable={false}
                                                                      onChange={({ value }) => handleChange("category")(value)}
                                                                      className={errors.category && touched.category && "is-invalid"}
                                                                      name="category"
                                                                  />
                                                                  {errors.category && touched.category && <div className="invalid-feedback">{errors.category}</div>}
                                                              </FormGroup>
                                                          </Col>

                                                          <Col lg={8}>
                                                              <FormGroup className="mb-3">
                                                                  <Label htmlFor="subject">Subject</Label>
                                                                  <Input
                                                                      type="text"
                                                                      id="subject"
                                                                      name="subject"
                                                                      placeholder="Question regarding dashboard"
                                                                      onChange={handleChange}
                                                                      value={values.subject}
                                                                      className={errors.subject && touched.subject && "is-invalid"}
                                                                  />
                                                                  {errors.subject && touched.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                                              </FormGroup>
                                                          </Col>
                                                          <Col lg={8}>
                                                              <FormGroup className="mb-3">
                                                                  <Label htmlFor="message">Message</Label>
                                                                  <Input
                                                                      type="textarea"
                                                                      id="message"
                                                                      row={10}
                                                                      name="message"
                                                                      placeholder="Explain exactly what went wrong and try to provide as much information as possible."
                                                                      onChange={handleChange}
                                                                      value={values.message}
                                                                      className={errors.message && touched.message && "is-invalid"}
                                                                  />
                                                                  {errors.message && touched.message && <div className="invalid-feedback">{errors.message}</div>}
                                                              </FormGroup>
                                                          </Col>
                                                      </Row>
                                                  </Col>
                                              </Row>
                                      }
                                  </CardBody>

                                  <Button color="primary" type="submit" className="" style={{width: 200, margin: "0 auto"}}>
                                      Create ticket
                                  </Button>

                              </Card>
                          </Form>
                      )}
                  </Formik>
              </Container>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
    user: state.auth.profile && state.auth.profile.username
});

export default connect(mapStateToProps)(Tickets)
