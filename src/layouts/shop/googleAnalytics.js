import React from 'react';

export function GoogleAnalytics(props) {

    const { tracking_id } = props

    if(!tracking_id) {
        return ""
    }

    return <>
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${tracking_id}`}></script>
        <script>
            {`
                console.log('Google Analytics START')

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', '${tracking_id}');

                console.log('Google Analytics END')
            `}
        </script>
    </>
}

export default GoogleAnalytics