import React from "react";
import "./mailLabel.css";

function MailLabel(props) {
    return (
        <div className="mailLabel">
            <p className="address">{props.address.split("@")[0]}</p>
            <p className="subject">{props.subject}</p>
            <p className="date">{props.date}</p>
        </div>
    );
}

export default MailLabel;