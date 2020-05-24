import React from 'react'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import { embedRoutes } from 'routes';
import layoutHOC from '../../HOC/layoutHOC'

import './style.scss'


class EmbedLayout extends React.Component {

    render() {

        return (
            <div className="admin-container app-embed">
                <Switch>
                    {embedRoutes.map((prop, key) => <Route {...prop} key={key} />)}
                </Switch>
            </div>
        )
    }
}

export default layoutHOC(EmbedLayout)