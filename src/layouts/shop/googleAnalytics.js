import React from 'react';

export function GoogleAnalytics(props) {

    const { tracking_id } = props

    if(!tracking_id) {
        return ""
    }

    return <>
        {/* <!-- Google Analytics --> */}
        <script>
            {`
                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                ga('create', '${tracking_id}', 'auto');
                ga('send', 'pageview');
            `}
        </script>
        <script async src='https://www.google-analytics.com/analytics.js'></script>
        {/* <!-- End Google Analytics --> */}
    </>
}

export default GoogleAnalytics