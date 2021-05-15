import React from "react";
import "./profileBtn.css";
import "font-awesome/css/font-awesome.min.css";

function ProfileBtn(props) {
    return (
        <div className="profileBtnDiv">
            <button className="profileBtn" onClick={props.onClick}>
                <i className="fa fa-user-circle"></i>
            </button>
        </div>
    );
}

export default ProfileBtn;