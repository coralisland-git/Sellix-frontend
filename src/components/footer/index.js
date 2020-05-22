import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.scss'

class Footer extends Component {
  
  render() {

    const { children, version, ...attributes } = this.props

    return (
      <React.Fragment>
        <div className="d-flex align-items-center justify-content-between w-100">
          
          <span>
            <Link to="/admin">Simple Vat</Link>&nbsp;
            {
              version !== '' ?
                <label className="mb-0 text-primary">v. {version}</label>
              :
                ''
            }
            &nbsp;&copy; 2019 All Rights Reserved.
          </span>
        </div>
      </React.Fragment>
    );
  }
}


export default Footer
