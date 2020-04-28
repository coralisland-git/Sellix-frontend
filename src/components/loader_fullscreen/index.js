import React from 'react'
import { Loader } from 'components';

export class LoaderFullscreen extends React.Component {

    state = {
        loaderFadingOut: false,
        loaderRemoved: false
    }

    componentDidMount() {
        if(!this.props.loaderRemovedInitially) {
			setTimeout(() => {
				this.setState({
					loaderFadingOut: true
				})
				setTimeout(() => {
					this.setState({
						loaderRemoved: true
					})
				}, 1000)
			}, 1000)
		} else {
			this.setState({
				loaderRemoved: true
			})
		}
    }

    render() {
        const { loaderFadingOut, loaderRemoved } = this.state;

        return <div style={{
            position: 'fixed',
            zIndex: 99999,
            left: 0,
            right: 0,
            height: '100%',
            display: loaderRemoved ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#211d3d',
            opacity: loaderFadingOut ? 0 : 1,
            transition: 'opacity 1s ease-in'
        }}>
            <Loader/>
        </div>
    }
}

export default LoaderFullscreen;