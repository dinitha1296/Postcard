import React from "react";
import "./logo.css";
import svgIcon from "./postcard.svg";

function Logo() {
    return (
        <div className="logo">
            <img src={svgIcon} alt="logo" className="logoImg"/>
            <p className="logoText">Postcard</p>
        </div>
    );
}

export default Logo;