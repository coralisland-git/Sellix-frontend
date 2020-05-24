import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { documentationRoutes } from 'routes'
import layoutHOC from '../../HOC/layoutHOC'

import AppHeader from '@coreui/react/es/Header'
import { NotFound, Header } from 'components'
import './style.scss'
import Nav from "./nav";
import {Container} from "../../components/reactstrap";


class DocumentationLayout extends React.Component {

  componentDidMount () {
    document.title = `Developers | Sellix`;
  }

  render() {
    return (
        <div className={"admin-container documentation " + this.props.theme}>
          <div className="app">
            <AppHeader fixed className="border-bottom">
              <Header isShop={true} isDocumentation={true} theme={this.props.theme} changeTheme={this.props.changeTheme} />
            </AppHeader>

            <div className="app-body">
              <Nav/>
              <main className="main">
                <Container className="p-0 h-100" fluid>
                  <Switch>
                    {documentationRoutes.map((props, key) => <Route{...props} key={key}/>)}
                    <Route path="*" component={NotFound} />
                  </Switch>
                </Container>
              </main>
            </div>
          </div>
        </div>
    )
  }
}

export default layoutHOC(DocumentationLayout)
