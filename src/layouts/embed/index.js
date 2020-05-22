import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { embedRoutes } from 'routes';
import initComponent from '../index';

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

export default initComponent(EmbedLayout)