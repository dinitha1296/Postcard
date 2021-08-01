import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import './chatToolsBar.css';
import Menu from "./menu";
import { logout } from '../../actions/authActions';
// import groupIcon from './group.svg';

const ChatToolsBar = (props) => {

    const [newChatMenu, setNewChatMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const dispatch = useDispatch();

    const newChatMenuItems = [
        {title: 'New chat', onClick: () => {
            props.openNewChatWindow();
            setNewChatMenu(false);
        }},
        {title: 'New group chat', onClick: () => {
            // TODO: Implement a method to open a new group chat
            setNewChatMenu(false);
        }}
    ];

    const profileMenuItems = [
        {title: 'logout', onClick: () => {
            setProfileMenu(false);
            logout(dispatch)(console.log);
        }}
    ];

    return (
        <div className="chatToolsBarDiv">
            <div className='chatToolsBarBtnContainer'>
                <button className="chatToolsBarBtn" title="New chat" disabled={profileMenu} onClick={() => setProfileMenu(true)}>
                    {/* <p className="toolBarIcon">+</p> */}
                    <i className="toolBarIconProfile fa fa-user-circle"></i>
                </button>
                {profileMenu && <Menu left={false} items={profileMenuItems} onClose={() => setProfileMenu(false)} />}
            </div>
            <div className='chatToolsBarTitle' />
            <div className='chatToolsBarBtnContainer'>
                <button className="chatToolsBarBtn" title="New chat" disabled={newChatMenu} onClick={() => setNewChatMenu(true)}>
                    <p className="toolBarIcon">+</p>
                </button>
                {newChatMenu && <Menu left={true} items={newChatMenuItems} onClose={() => setNewChatMenu(false)}/>}
            </div>
        </div>
    );
}

export default ChatToolsBar;