import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStatus, getStatusViaWebsocket } from '../../admin/settings/actions'
import IntervalTimer from "react-interval-timer";

import '../style.scss'



class Status extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      status: {},
      loading: true,
      hide: false
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.getStatus()
        .then(({ data: { status } }) => {

          this.setState({
            status: {
              ...status.messages,
              status: status.status,
            },
            hide: status.messages ? localStorage.getItem(status.messages.id) : true
          })
        })
        .finally(() => {
          this.setState({ loading: false })
        })
  }

    getStatusViaWebsocket = () => {

        this.props.getStatusViaWebsocket()
            .then((status) => {
                this.setState({
                    status: {
                        ...status.messages,
                        status: status.status,
                    },
                    hide: status.messages ? localStorage.getItem(status.messages.id) : true
                })
            })
    }

  hideAlert = () => {
      localStorage.setItem(this.state.status.id, "true");

      this.setState({
          hide: true
      })
  }

  render() {

    const { status, loading, hide } = this.state;

    if(loading || +status.status === 1 || hide) {
      return <IntervalTimer timeout={3000} callback={this.getStatusViaWebsocket} enabled={true} repeat={true} />
    }

    return (
        <div className={"d-flex status-alert"}>
          <IntervalTimer timeout={3000} callback={this.getStatusViaWebsocket} enabled={true} repeat={true} />
          <div className={status.type + " status-alert-status"}>
            {status.type === "red" && <i className={"far fa-times-circle"} />}
            {status.type === "blue" && <i className="fas fa-exclamation-triangle" />}
            {status.type === "green" && <i className="far fa-check-circle" />}
          </div>
          <div className={"w-100 status-alert-container"}>
            <div className={status.type + " status-alert-title"}>{status.title}</div>
            <div className={"status-alert-message"}>{status.message}</div>
          </div>
            <div className={"status-alert-hide"} onClick={this.hideAlert}><i className={"fas fa-times"}/></div>
        </div>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  getStatus: bindActionCreators(getStatus, dispatch),
    getStatusViaWebsocket: bindActionCreators(getStatusViaWebsocket, dispatch),
})

export default connect(null, mapDispatchToProps)(Status)
