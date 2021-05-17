import React, { useEffect, useState } from "react";
import { EmojiConvertor } from "emoji-js";

import "./message.css";

const MessageMenu = (props) => {

    return (
        <div className="messageMenu">
            {props.deleteForMe && 
            <div className="messageMenuItem" onClick={props.onDelete(false)}><span>Delete for me</span></div>}
            {props.deleteForAll && 
            <div className="messageMenuItem" onClick={props.onDelete(true)}><span>Delete for all</span></div>}
            <div className="messageMenuItem"><span>Message Info</span></div>
        </div>
    );
}

const Message = (props) => {
    
    const [menuSelected, selectMenu] = useState(false);

    let menuRef = React.createRef();

    const date = new Date(props.message.date);
    const time = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');

    const onMenuBtnClcik = () => selectMenu(!menuSelected)

    const menuBtnStyle = (e) => {
        if (menuSelected) {
            return ({
                backgroundColor: `${props.sent ? "#f7c78d" : "#ffffff"}`,
                visibility: 'visible',
                boxShadow: "0px 0px 5px grey"
            });
        }
        return null;
    }

    const handleOutsideClick = (e) => {
        if (document.getElementById(`message_${props.message._id}`).contains(e.target)) return;
        selectMenu(false);
    }

    useEffect (() => {

        document.addEventListener('mousedown', handleOutsideClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick, false);
        }
    });

    const onDelete = (deleteForAll) => () => {
        props.onDelete(props.chatId, props.message._id, deleteForAll);
        selectMenu(false);
    }

    const emoji = new EmojiConvertor();
    emoji.img_sets.apple.path = "https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.1/img/apple/64/";

    const messageBody = 
        props.message.body ? 
        <span dangerouslySetInnerHTML={{__html: emoji.replace_unified(props.message.body)}} /> :
        <span style={{fontStyle: "italic", color: "gray"}}>This message was deleted.</span>

    return (
        <div className={`container`}>
            <div 
                id={`message_${props.message._id}`}
                className={`message${props.sent ? ' right' : ' left'}`} 
                style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}
            >
                <button 
                    className="messageMenuBtn"
                    onClick={onMenuBtnClcik}
                    style={menuBtnStyle()}
                    ref={menuRef}
                >
                    <i className={`fa fa-chevron-${menuSelected ? "up" : "down"}`}></i>
                </button>
                {
                    menuSelected && 
                    <MessageMenu 
                        onDelete={onDelete} 
                        deleteForMe={props.message.body !== ""}
                        deleteForAll={props.message.body !== "" && props.sent}
                    />
                }
                {messageBody}
                <p className="time">{time}</p>
            </div>
        </div>
    );
}

export default Message;