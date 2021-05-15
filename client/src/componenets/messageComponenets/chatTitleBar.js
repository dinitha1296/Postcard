import React from "react";

import "./chatTitleBar.css";
// import grin from './grin-regular.svg'

function ChatTitleBar(props) {
    
    return (
        <div className="chatTitleBarDiv">
            <p className="chatTitle">{props.chatTitle}</p>
        </div>
    );
}

export default ChatTitleBar;