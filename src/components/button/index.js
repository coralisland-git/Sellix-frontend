import React, { Component } from 'react'
import { Button } from 'components/reactstrap'

import './style.scss'


class CustomButton extends Component {

    componentDidMount() {
        const { color="default", skip } = this.props;

        if(skip) {
            return
        }

        this.button.addEventListener('mousedown', function (e) {

            if(e.button === 2) {
                return false
            }

            const theme = [...document.body.classList].includes('dark') || 'light'

            let button = this;
            let ripple = document.createElement('span')
                ripple.classList.add('ripple-effect')

            let rect = button.getBoundingClientRect();

            let xPos = (e.x - rect.left);
            let yPos = (e.y - rect.top);
            let scaledSize = Math.max( rect.width , rect.height) * Math.PI * 1.5;

            ripple.style.left = `${xPos}px`;
            ripple.style.top = `${yPos}px`;
            ripple.style.backgroundColor = color === 'default' && theme === 'light' ? 'black' : 'white';
            ripple.style.opacity = 0.175;

            button.appendChild(ripple);

            let rippleAnimate = ripple
                .animate({
                    height: ['0px', `${scaledSize}px`],
                    width: ['0px', `${scaledSize}px`]
                }, {
                    duration: 700
                })
            rippleAnimate.onfinish = () => {
                ripple.style.width = `${scaledSize}px`;
                ripple.style.height = `${scaledSize}px`;
            };

            button.addEventListener('mouseup', (e) => {
                let rippleAnimate = ripple.animate({
                    'opacity': [.175, 0]
                }, {
                    duration: 700/3
                })

                rippleAnimate.onfinish = () => ripple.remove();
            })
            button.addEventListener('mouseover', (e) => {
                let rippleAnimate = ripple.animate({
                    'opacity': [.175, 0]
                }, {
                    duration: 700/3
                })

                rippleAnimate.onfinish = () => ripple.remove();
            })
        })
    }

  render() {
    const { className, children, skip, ...rest } = this.props;

    return (
        <Button className={className + " md-btn"} {...rest} innerRef={(ref) => this.button = ref}>
            {children}
        </Button>
    );
  }
}


export default CustomButton
