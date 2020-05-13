import React from "react";

export default ({ progress, isPositive, is24 }) => {
	if(is24) {
		return (
			<div className={'progress-indicator'} >
				{progress !== 0 ?
					(isPositive ?
						<span>+<b>{(Math.round(progress*100)/100).toFixed(2) > 1000 ? 1000 : (Math.round(progress*100)/100).toFixed(2)}</b>%</span> :
						<span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>) :
					<span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>
				}
				{
					progress !== 0 ?
						<i className={`fas fa-caret-${isPositive ? 'up' : 'down'}`} />:
						<i className={`fa fa-minus`} />
				}
			</div>
		)
	} else {
		return null
	}
}
