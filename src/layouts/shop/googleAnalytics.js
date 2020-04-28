import React from 'react';
import Analytics from 'react-router-ga';

export function GoogleAnalytics(props) {

    const { tracking_id } = props

    if(!tracking_id) {
        console.log('rendered non-GA')
        return <>
            {props.children}
        </>
    }

    console.log('rendered GA')

    return <Analytics id={tracking_id} debug>
        {props.children}
    </Analytics>
}

export default GoogleAnalytics