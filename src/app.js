import React from 'react'

import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'

import { mainRoutes } from 'routes'
import { configureStore } from 'services'
import { Loading, NotFound } from 'components'

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
  }

  render () {
    
    return (

      <Provider store={store}>
        <Router history={history}>
          <React.Suspense fallback={Loading()}>
            <Switch>
              {mainRoutes.map((props, key) => <Route key={key} {...props} />)}
              <Route component={NotFound} />
            </Switch>
          </React.Suspense>
        </Router>
      </Provider>
    )
  }

}

