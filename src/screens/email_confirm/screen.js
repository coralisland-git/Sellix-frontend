import React from 'react'
import { api } from 'utils'

class EmailConfirm extends React.Component {

  componentDidMount() {

    let { match: { params } } = this.props;

    let form = new FormData();
    form.append('secret', params.code)
    api.post('validate', form)
        .then((res) => {
            if(res.status === 200) {
                this.props.history.push({
                    pathname: '/auth/login',
                    state: { code: true, message: res.message }
                })
            } else {
                this.props.history.push({
                    pathname: '/auth/login',
                    state: { code: false, message: res.error }
                })
            }
        })
        .catch((err) => {
          this.props.history.push({
            pathname: '/',
            state: { code: false, message: err.error }
          })
        })
  }

  render() {
    return null
  }
}

export default EmailConfirm
