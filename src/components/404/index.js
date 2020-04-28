import React, { Component } from 'react'
import pageNotFound from 'assets/images/Magnifying_glass_icon.svg'


class NotFound extends Component {

    componentDidMount() {
        document.title = `404 Page Not Found | Sellix`;
    }

    render() {
    return (
      <div style={{
        textAlign: 'center',
        padding: '100px',
        background: 'white'
      }}>
        <img src={pageNotFound} width="150"/>
        <h1 className="text-primary" style={{marginTop: '50px'}}>404 Page Not Found</h1>
      </div>
    );
  }
}

export default NotFound
