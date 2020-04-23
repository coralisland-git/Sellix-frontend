import React, { Component } from 'react'
import pageNotFound from 'assets/images/page-not-found.jpg'


class NotFound extends Component {

    componentDidMount() {
        document.title = `Sellix - 404`;
    }

    render() {
    return (
      <React.Fragment>
        <div className="bg-white d-flex align-items-center justify-content-center w-100" style={{height: '100vh'}}>
          <img src={pageNotFound} style={{width: '100%', maxWidth: 350}}/>
        </div>
      </React.Fragment>
    );
  }
}

export default NotFound
