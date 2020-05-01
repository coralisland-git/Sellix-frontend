import React from 'react'
import Dark from '../../assets/images/loader_logo_dark.svg'
import Light from '../../assets/images/loader_logo_light.svg'

const Loader = ({ className }) => (
    <div className={(className || " ") + " custom-loader"}>
        <div className="custom-loader-bounce1" />
        <img src={window.localStorage.getItem('theme') === 'dark' ? Light : Dark} alt="" />
        <div className="custom-loader-bounce2" />
    </div>
);

export default Loader;
