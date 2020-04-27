import React, { Component } from 'react'
import { Button } from 'reactstrap'

import './style.scss'


class CustomButton extends Component {

    componentDidMount() {
        this.button.addEventListener('mousedown', function (e) {
            if(e.button === 2) {
                return false
            }

            let button = this;
            let ripple = document.createElement('span')
                ripple.classList.add('ripple-effect')

            let rect = button.getBoundingClientRect();

            let xPos = (e.x - rect.left);
            let yPos = (e.y - rect.top);
            let scaledSize = Math.max( rect.width , rect.height) * Math.PI * 1.5;

            console.log(e.pageY, rect.top)
            // debugger;
            ripple.style.left = `${xPos}px`;
            ripple.style.top = `${yPos}px`;
            ripple.style.backgroundColor = 'white';
            ripple.style.opacity = 0.175;

            button.appendChild(ripple);

            ripple
                .animate({
                    height: ['0px', `${scaledSize}px`],
                    width: ['0px', `${scaledSize}px`]
                }, {
                    duration: 700/3*2
                })

            button.addEventListener('mouseup', (e) => {
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
    const { className, children, ...rest } = this.props;

    return (
        <Button className={className + " md-btn"} {...rest} innerRef={(ref) => this.button = ref}>
            {children}
        </Button>
    );
  }
}


export default CustomButton
