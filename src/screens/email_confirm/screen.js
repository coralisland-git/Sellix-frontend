import React from 'react'

class EmailConfirm extends React.Component {

  componentDidMount() {

    let { match: { params } } = this.props;

    if(params.code) {
      setTimeout(() => {
        this.props.history.push({
          pathname: '/auth/login',
          state: { code: true, message: 'You have successfully activated your account' }
        })
      }, 2000)
    } else {
      this.props.history.push({
        pathname: '/',
        state: { code: false, message: 'Something went wrong!' }
      })
    }
  }

  render() {
    return null
  }
}

export default EmailConfirm