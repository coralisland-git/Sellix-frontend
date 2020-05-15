import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import *  as _ from 'lodash'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Formik } from 'formik'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import Select from 'react-select'
import { Loader } from 'components'
import {
    CommonActions
} from 'services/global'
import { getSettings } from '../../actions'
import { getUser } from './actions'
import {updateUser} from './actions'


import './style.scss'

const mapStateToProps = (state) => {
    return ({
        user: state.users.user
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators({ updateUser }, dispatch),
        getUser: bindActionCreators({getUser}, dispatch),
        // editSettings: bindActionCreators({ editSettings }, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    })
}

const userData = [
    { label: 'Username', key: 'username' },
    { label: 'Email', key: 'email' },
    { label: 'Email_2fa', key: 'email_2fa' },
    { label: 'Otp_2fa', key: 'otp_2fa' },
]

class SettingsEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }

    }

    componentDidMount() {
        this.props.getUser.getUser(this.props.match.params.id)
    }

    rednerUserRow = (props) => {
        return _.map(userData, row => {
            if (row.key === 'username' || row.key === 'email') {
                return <Row>
                    <Col lg={12}>
                        <FormGroup className="mb-3">
                            <Label htmlFor="product_code">{row.label}</Label>
                            <div className="d-flex">
                                <Input
                                    name={row.key}
                                    onChange={props.handleChange}
                                    value={props.values[row.key]}
                                />
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
            } else {
                return <Row>
                    <Col lg={12}>
                        <FormGroup className="mb-3" check>
                            <Label htmlFor="product_code" check>
                        
                                <Input
                                    type="checkbox"
                                    name={row.key}
                                    onChange={(value) => {
                                        props.handleChange(row.key)(value);
                                    }}
                                    value={props.values[row.key]}
                                />
                                {row.label}
                          </Label>
                        </FormGroup>
                    </Col>
                </Row>
            }
        })
    }

      handleSubmit(values) {
        const dataForSend = _.pick(values, _.map(userData, 'key'))
        const correctFormatForSend = _.mapValues(dataForSend, data => {
            if(data === true){
                return 1
            }
            if(data === false){
                return 0
            }
            return data
        })
        this.setState({ loading: true })
        this.props.actions.updateUser(correctFormatForSend).then(res => {
          this.props.commonActions.tostifyAlert('success', res.message)
          this.props.history.push({
            pathname: `/admin/users`
          })
        }).catch(err => {
          this.props.commonActions.tostifyAlert('error', err.error)
        }).finally(() => {
          this.setState({ loading: false })
        })
      }

    render() {
        const { loading } = this.state;
        if (!this.props.user) { return null }
        return (
            <div className="product-screen mt-3">
                <div className="animated fadeIn">
                    <Breadcrumb className="mb-0">
                        <BreadcrumbItem active className="mb-0">
                            <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left" /> User Info</a>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Formik
                        initialValues={this.props.user}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.handleSubmit(values)
                        }}>{props => (
                            <Form onSubmit={props.handleSubmit}>
                                <Card>
                                    <CardHeader>
                                        <Row style={{ alignItems: 'center' }}>
                                            <Col md={12}>
                                                <h1>Edit User</h1>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody className="p-4 mb-5">
                                        {
                                            loading ?
                                                <Row>
                                                    <Col lg={12}>
                                                        <Loader />
                                                    </Col>
                                                </Row>
                                                :
                                                <Row className="mt-4 mb-4">
                                                    <Col lg={12}>
                                                        {this.rednerUserRow(props)}
                                                    </Col>
                                                </Row>
                                        }
                                    </CardBody>
                                    <Button color="primary" className="" style={{ width: 200 }}>Save Settings</Button>
                                </Card>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEdit)
