import React from 'react';
import Analytics from 'react-router-ga';

export default ({ children, tracking_id }) =>
    !tracking_id ?
        <>{children}</> :
        <Analytics id={tracking_id} debug>{children}</Analytics>