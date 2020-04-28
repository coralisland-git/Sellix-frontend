import React, { useState, useEffect } from 'react'
import { api } from 'utils'
import { Loading } from 'components'
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  Input,
  Container
} from 'reactstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  CommonActions
} from 'services/global'
import * as Yup from "yup";
import { Formik } from 'formik'
import {createChangelog} from './actions'

import "./styles.scss";

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    createChangelog: bindActionCreators(createChangelog, dispatch),
  })
}
const mapStateToProps = (state) => {
  return ({

  })
}


function ChangelogItem({ item }) {

  const [showMore, setShowMore] = useState(false)

  const hasShowMore = item.message.length > 75

  return <div className={"changelog-container"}>
    <h4>{item.title}</h4>
    <div className={"changelog"}>
      <p>{item.display_date}</p>
      <p style={{ padding: '0 3rem', width: "30rem" }}>{hasShowMore && !showMore ? item.message.substr(0, 75) + '...' : item.message}</p>
      <div className={'changelog-badge'}>{item.badge}</div>
    </div>
    {hasShowMore && <span onClick={() => setShowMore(!showMore)} className={'changelog-show-more'}>Show {showMore ? 'less' : 'more'}</span>}
  </div>
}

export class Changelog extends React.Component {

  state = {
    changelog: null
  }

  componentDidMount() {
    document.title = `Changelog | Sellix`;

    return api.get('/changelog')
      .then(res => {
        if (res.status === 200) {
          this.setState({
            changelog: res.data.changelog
          })
        } else {
          throw res
        }
      }).catch(err => {
        throw err
      })
  }

  handleSubmit(values) {
    this.setState({ loading: true })
    this.props.createChangelog({ ...values, display_date: '24/04/2020' }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || err.message)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    const { changelog } = this.state

    return <div className={'changelog-screen'}>
      <div className="section text-center">
        <Container className="home-container" fluid>
          <h1>Changelog</h1>
          <p className={'large'}>Latest notable changes</p>
        </Container>
      </div>

      <div className="section text-center bg-white" style={{ paddingBottom: "5rem", display: 'flex'}}>
        <Container className="home-container d-flex flex-column justify-content-center align-items-center">
        <Formik
            noValidate="noValidate"
						initialValues={{message: ''}}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}
            validationSchema={Yup.object().shape({
							message: Yup.string().required('Message is required'),
						})}>{props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardBody className="mt-4 pb-3 pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="title text-primary f-18">Create a Changelog</h4>
                    </div>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="warehouseName">Title</Label>
                          <Input
                            name='title' 
                            type="text" 
                            placeholder="Title" 
                            onChange={props.handleChange}
                            value={props.values.title}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="warehouseName">Badge</Label>
                          <Input 
                            name='badge'
                            placeholder="Badge"
                            onChange={props.handleChange}
                            value={props.values.badge}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="warehouseName">Message</Label>
                          <Input 
                            name='message' 
                            className="pt-3 pb-3" 
                            rows={5} 
                            placeholder="Message" 
                            onChange={props.handleChange}
                            value={props.values.message}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="primary" className="mt-4 mb-3">Create</Button>
                  </CardBody>
                </Card>
              </Form>
            )}
            </Formik>
        </Container>
        <Container className="home-container d-flex flex-column justify-content-center align-items-center">
          {changelog === null ? <Loading /> : changelog.map((item, key) => <ChangelogItem key={key} item={item} />)}
        </Container>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Changelog)