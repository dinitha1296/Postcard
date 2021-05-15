import React from "react";
import './application.css';
// import Navbar from '../containers/navbar.js';
// import MailContainer from '../containers/mailContainer.js';
import MessageContainer from '../containers/messageContainer.js';
import socket from "../services/socket";
// import axios from "axios";
// import { PromiseProvider } from 'mongoose';

class Application extends React.Component {
    /* const mailList={
        a001:{
            address: "dinitha1296@gmail.com",
            subject: "First Project",
            date: "Today"
        },
        a002:{
            address: "dinitha1296@gmail.com",
            subject: "First Project",
            date: "Today"
        },
        a003:{
            address: "dinitha1296@gmail.com",
            subject: "First Project",
            date: "Today"
        },
        a004:{
            address: "dinitha1296@gmail.com",
            subject: "First Project",
            date: "Today"
        }
    }; */
    
    constructor() {
        super();
        this.socket = socket;
    }

    // axios.post('/echo', {location: "application.js", user: JSON.parse(localStorage.getItem('user')).chats[0].chatWith})

    componentDidMount() {
        // this.socket = openSocket();
        this.socket.emit('logged', {
            userId: JSON.parse(localStorage.getItem('user'))._id,
            chats: JSON.parse(localStorage.getItem('user')).chats
        })
    }

    render() {
        // const messages = [
        //     {
        //         body: "Message1",
        //         date: new Date(),
        //         sent: true
        //     },
        //     {
        //         body: "Message2",
        //         date: new Date(),
        //         sent: false
        //     },
        //     {
        //         body: "Message3",
        //         date: new Date(),
        //         sent: false
        //     },
        //     {
        //         body: "Message4",
        //         date: new Date(),
        //         sent: true
        //     },
        //     {
        //         body: "Message5 ffdfdfddddddddddd ff f",
        //         date: new Date(),
        //         sent: false
        //     },
        //     {
        //         body: "Message6 ffffffffff fffffffff fffffff ffffffffff ffffffffffff fffff",
        //         date: new Date(),
        //         sent: true
        //     },
        //     {
        //         body: "Message7 dfd df dfd fd fffff f ffff f f",
        //         date: new Date(),
        //         sent: false
        //     },
        //     {
        //         body: "Message8sdfsdfsdfsdfsdfsdfs dfdsf sfsdf sdf",
        //         date: new Date(),
        //         sent: true
        //     },
        //     {
        //         body: "Message9",
        //         date: new Date(),
        //         sent: false
        //     },
        //     {
        //         body: "Message10",
        //         date: new Date(),
        //         sent: true
        //     }
        // ];
        // const chatHeads = [
        //     {
        //         title: "Another1"
        //     },
        //     {
        //         title: "Another1"
        //     },
        //     {
        //         title: "Another1"
        //     }
        // ];
        return (
            <div className="app">
                {/* <Navbar onLogout={this.props.onLogout} /> */}
                <div className="mainContent">
                    <MessageContainer chatHeads={JSON.parse(localStorage.getItem("user")).chats}/>
                </div>
            </div>
        );
    }
}
  
export default Application;