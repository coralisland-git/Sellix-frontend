import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import 'assets/css/global.scss'

import App from 'app'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

