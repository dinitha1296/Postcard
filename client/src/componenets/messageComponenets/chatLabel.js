import React from "react";
import "./chatLabel.css";
import defaultProfilePic from "./profilePicDefault.svg";

function ChatLabel(props) {
    
    //const profilePic = (props.chatHead.profilePic == null) ? props.chatHead.profilePic : defaultProfilePic;

    const onSelect = () => {
        if (!props.isSelected) {
            props.onClick(props.chatHead);
        }
    }

    const firstName = props.chatHead.chatWith.firstName;
    const lastName = props.chatHead.chatWith.lastName;
    const labelColor = props.isSelected ? {backgroundColor: "rgb(210, 210, 210)"} : null;

    return (
        <button style={labelColor} onClick={onSelect} className="chatHead">
           <img alt="profile" src={defaultProfilePic} className="profilePic"/>
           <span>{firstName + (lastName ? " " + lastName : "" )}</span>
        </button>
    );
} 

export default ChatLabel;