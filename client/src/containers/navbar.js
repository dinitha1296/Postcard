import React from "react";
import Logo from "../componenets/logo";
import Menu from "../componenets/menu";
import ProfileBtn from "../componenets/profileBtn";
import SearchBar from "../componenets/searchBar";
import SettingsBtn from "../componenets/settingsBtn";
import ToggleMode from "../componenets/toggleMode";
import "./navbar.css";

function Navbar(props) {
    return (
        <div className="navBar">
            <Menu />
            <Logo />
            <SearchBar />
            <ToggleMode />
            <SettingsBtn />
            <ProfileBtn onClick={props.onLogout}/>
        </div>
    );
}

export default Navbar;