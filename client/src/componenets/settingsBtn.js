import React from "react";
import "./settingsBtn.css"
import "font-awesome/css/font-awesome.min.css";

function SettingsBtn() {
    return (
        <div className="settingsBtnDiv">
            <button className="settingsBtn">
                <i className="fa fa-cog"></i>
            </button>
        </div>
    );
}

export default SettingsBtn;