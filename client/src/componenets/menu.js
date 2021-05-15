import React from "react";
import "./menu.css";
import "font-awesome/css/font-awesome.min.css";

function Menu() {
    return (
        <div className="menu">
            <button className="menuBtn">
                <i className="fa fa-bars menuBtnIcon"></i>
            </button>
        </div>
    );
}

export default Menu;