import React from "react";

import './chatToolsBar.css';

const ChatToolsBar = (props) => {

    return (
        <div className="chatToolsBarDiv">
            <button className="chatToolsBarBtn" title="New chat" onClick={props.openNewChatWindow}>
                <p className="toolBarIcon">+</p>
            </button>
        </div>
    );
}

export default ChatToolsBar;