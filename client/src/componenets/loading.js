import React from 'react';

import './loading.css';

const loading_style = {
    position: 'relative',
    margin: '0px auto',
    width: '35px',
    height: '35px',
    strokeWidth: '4.5'
}

class Loading extends React.Component {
    render () {

        const { width, height, margin, strokeWidth } = this.props;

        if (width) loading_style.width = width;
        if (height) loading_style.height = height;
        if (margin) loading_style.margin = margin;
        
        return (
            <div className="loadingDiv" style={loading_style}>
                <svg className="loadingSvg"  viewBox="25 25 50 50">
                    <circle className="loadingCircle" cx="50" cy="50" r="20" fill="none" strokeWidth={strokeWidth} strokeMiterlimit="10"/>
                </svg>
            </div>
        )
       
    }
}

export default Loading;