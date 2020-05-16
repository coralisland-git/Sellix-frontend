import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStatus } from '../../admin/settings/actions'


import '../style.scss'


class Status extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      status: {},
      loading: true
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
            }
          })
        })
        .finally(() => {
          this.setState({ loading: false })
        })
  }

  render() {

    const { status, loading } = this.state;

    console.log(status);

    return null;

    if(loading || +status.status === 1) {
      return null
    }

    return (
        <div className={"d-flex status-alert"}>
          <div className={status.type + " status-alert-status"}>
            {status.type === "red" && <i className={"far fa-times-circle"} />}
            {status.type === "blue" && <i className="fas fa-exclamation-triangle" />}
            {status.type === "green" && <i className="far fa-check-circle" />}
          </div>
          <div className={"w-100 status-alert-container"}>
            <div className={status.type + " status-alert-title"}>{status.title}</div>
            <div className={"status-alert-message"}>{status.message}</div>
          </div>
        </div>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  getStatus: bindActionCreators(getStatus, dispatch),
})

export default connect(null, mapDispatchToProps)(Status)
