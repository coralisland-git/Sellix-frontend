import React from 'react';
import Analytics from 'react-router-ga';

export function GoogleAnalytics({ children, tracking_id }) {
    if(!tracking_id) {
        return <>{children}</>
    } else {
        return <Analytics id={tracking_id} debug>{children}</Analytics>
    }
}

export default GoogleAnalytics