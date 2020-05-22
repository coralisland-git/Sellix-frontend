import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { documentationRoutes } from 'routes'
import layoutHOC from '../../HOC/layoutHOC'

import AppHeader from '@coreui/react/es/Header'
import { NotFound, Header } from 'components'

import './style.scss'


class DocumentationLayout extends React.Component {

  componentDidMount () {
    document.title = `Developers | Sellix`;
  }

  render() {
    return (
        <div className={"admin-container documentation"}>
          <div className="app">
            <AppHeader fixed className="border-bottom">
              <Header isShop={true} isDocumentation={true} theme={this.props.theme} changeTheme={this.props.changeTheme} />
            </AppHeader>
            <div className="app-body">
              <main className="main">
                <Switch>
                  {documentationRoutes.map((props, key) => <Route{...props} key={key}/>)}
                  <Route path="*" component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>
        </div>
    )
  }
}

export default layoutHOC(DocumentationLayout)
