import React from "react";

import "./chatTitleBar.css";
import backArrow from "./backArrow.svg";
// import grin from './grin-regular.svg'

function ChatTitleBar(props) {
    
    return (
        <div className="chatTitleBarDiv">
            {props.isMobile && <button className="chatTitleBackBtn" onClick={props.onBack}><img src={backArrow} alt="b"></img></button>}
            <p className="chatTitle">{props.chatTitle}</p>
        </div>
    );
}

export default ChatTitleBar;