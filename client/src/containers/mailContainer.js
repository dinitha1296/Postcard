import React from "react";
import MailLabel from "../componenets/mailLabel.js"
import "./mailContainer.css";

function MailContainer(props) {

    return (
        <div className="mailContainerDiv">
            {Object.keys(props.mails).map(id => {
                return (
                    <MailLabel 
                    address={props.mails[id].address}
                    subject={props.mails[id].subject}
                    date={props.mails[id].date}/>
                );
            })}
        </div>
    );
}

export default MailContainer;