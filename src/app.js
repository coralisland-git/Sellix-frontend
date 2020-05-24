import React from 'react'

import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import Router from 'react-router-dom/es/Router'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'

import { mainRoutes } from 'routes'
import { configureStore } from 'services'
import { NotFound } from 'components'

import 'app.scss'
import SingleLogo from './assets/images/single.png'

const history = createBrowserHistory()
const store = configureStore()


export default class App extends React.Component {

  componentDidMount() {
    for(const elem of document.querySelectorAll('[putSinglePngHrefHere]')) {
      elem.href = SingleLogo
    }

    for(const elem of document.querySelectorAll('[putSinglePngContentHere]')) {
      elem.content = SingleLogo
    }

    const theme = window.localStorage.getItem('theme') || 'light'

    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme);
  }

  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            {mainRoutes.map((props, key) => <Route key={key} {...props} />)}
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    )
  }

}

