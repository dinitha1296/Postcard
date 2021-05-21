import React from "react";
import { connect } from "react-redux";

import './application.css';
import MessageContainer from '../containers/messageContainer.js';
import socket from "../services/socket";
import { resize } from "../actions/resizeActions";

class Application extends React.Component {
    
    constructor() {
        super();
        this.socket = socket;
    }

    componentDidMount() {
        this.socket.emit('logged', {
            userId: JSON.parse(localStorage.getItem('user'))._id,
            chats: JSON.parse(localStorage.getItem('user')).chats
        })
        window.addEventListener('resize', () => {
            this.props.resize(window.innerWidth);
        });
    }

    componentWillUnmount () {
        window.removeEventListener('resize', () => {
            this.props.resize(window.innerWidth);
        });
    }

    render() {
        return (
            <div className="mainContent">
                <MessageContainer chatHeads={JSON.parse(localStorage.getItem("user")).chats}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resize: (width) => resize(dispatch, width) 
    }
} 
  
export default connect(null, mapDispatchToProps)(Application);