import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, Button } from 'reactstrap'
import { isEmpty, map } from 'lodash'
import { Loader } from 'components'
import { getSettings as fetchSettings } from './actions'
import { CommonActions } from "../../services/global";
import Sellix from "../../assets/images/loader_logo_dark.svg";

import './style.scss';



const mapStateToProps = ({ settings: { settings } }) => ({ settings })

const mapDispatchToProps = dispatch => ({
  getSettings: bindActionCreators(fetchSettings, dispatch)
})


class Settings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showPlaceholder: false
    }
  }

  componentDidMount() {

    this.props.getSettings()
        .then(({ status }) => {
          if(status === 401) {
            this.setState({ showPlaceholder: true })
          }
        })
  }

  renderSettings = (settings) => (
      map(settings, (value, key) => (
          <div className="settingRow" key={key}>
            <div className='settingRowKey'>{key}:</div><div>{value}</div>
          </div>
      ))
  )

  editSettings = () => {
    this.props.history.push({
      pathname: `/admin/settings/edit`
    })
  }


  render() {

    const { loading, showPlaceholder } = this.state;
    const { settings } = this.props;

    // background: #000;
    // top: 0;
    // left: 0;
    // color: #fff;

    return (
      <div className="product-screen h-100">
        <div className="animated fadeIn h-100">
          <Card className="grey h-100">

            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4} className="settings-titleBlock">
                  <h1>Settings</h1>
                  <Button color="primary" onClick={this.editSettings} className="mt-4 mb-3">Edit</Button>
                </Col>
              </Row>
            </CardHeader>

            <CardBody className="p-0">
              {loading && <Row><Col lg={12}><Loader /></Col></Row>}
              {!loading && this.renderSettings(settings)}
              {(!loading && isEmpty(settings) && showPlaceholder) &&
                <div
                    className={'position-absolute w-100 h-100 d-flex justify-content-center'}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: "1.5rem",
                      color: "#6a3de3",
                      fontWeight: 600,
                      width: "calc(100% + 2rem)",
                      height: "calc(100% + 2rem)"
                    }}>
                  <div className={"d-flex align-items-center justify-content-center flex-column flex-direction-column direction-column "}>
                    <Loader className={"override-loader"} />
                    <div>Unauthorized to view this content</div>
                  </div>
                </div>
              }
            </CardBody>

          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
