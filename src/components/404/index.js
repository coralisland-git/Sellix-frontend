import React, { Component } from 'react'
import pageNotFound from 'assets/images/Magnifying_glass_icon.svg'


class NotFound extends Component {

    componentDidMount() {
        document.title = `404 Page Not Found | Sellix`;
    }

    render() {
        return (
          <div className={"text-center"} style={{ padding: '100px', paddingBottom: '200px', background: 'white'}}>
            <style>
              {`
                .footer-hr {
                  display: none;
                }
              `}
            </style>
            <img src={pageNotFound} width="150" alt={"Sellix"}/>
            <h1 className="text-primary" style={{ marginTop: '50px' }}>404 Page Not Found</h1>
          </div>
        );
  }
}

export default NotFound
