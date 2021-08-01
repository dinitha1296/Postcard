import React, { useEffect, useRef } from 'react';

import './menu.css';

const Menu = (props) => {

    const ref = useRef(null);

    const handleOutsideClick = (e) => {;
        if (ref.current.contains(e.target)) return;
        props.onClose();
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick, false);
        return () => document.removeEventListener('mousedown', handleOutsideClick, false);
    })

    const containerStyle = props.left ? {right: '1.2em'}: {left: '1.2em'} ;

    return (
        <div className="menuContainer" style={containerStyle} ref={ref}>
            <ul>
                {Object.keys(props.items).map(itemKey => {
                    const item = props.items[itemKey];
                    return (
                        <li key={itemKey}><div 
                            className="menuItem" 
                            onClick={item.onClick}>
                            <span>{item.title}</span>
                        </div></li>
                    )
                })}
            </ul>
        </div>
    );
}

export default Menu;