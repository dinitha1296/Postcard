import React, { useState } from "react";
import { animateScroll } from "react-scroll";
// import { io } from "socket.io-client";

import Message from "../componenets/messageComponenets/message";
import MessageTextField from "../componenets/messageComponenets/messageTextField";
import ChatLabel from "../componenets/messageComponenets/chatLabel";
import ChatTitleBar from "../componenets/messageComponenets/chatTitleBar";
import ChatToolsBar from "../componenets/messageComponenets/chatToolsBar";
import NewChatWindow from "../componenets/messageComponenets/newChatWindow";
import Loading from "../componenets/loading";
import "./messageContainer.css";
import messageServices from "../services/messages.services";
import axios from "axios";
import socket from "../services/socket";


const ChatHeads = (props) => {
    
    if (props.isLoading) return <div className="chatHeadLoadingDiv"><Loading /></div>;

    const changeChat = (newChat) => {
        props.changeChat(newChat);
    }

    // axios.post('/echo', {location: "messageContainer.js", method: "chatHeads", this: this, selectedChat: selectedChat, changeChat: changeChat});
    const chatHeadList = props.chatHeads.map((ch) => {
        return (
            <li key={ch._id}>
                <ChatLabel 
                    chatHead={ch} 
                    onClick={changeChat} 
                    isSelected = {ch._id === props.selectedChat._id}
                />
            </li>
        );
    });
    return <ul className="chatList">{chatHeadList}</ul>;
}

class MessageContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: {},
            newChatWindowOn: false,
            chatHeads: this.props.chatHeads,
            chatHeadsLoading: false
        }
    }

    scrollToBottom(divId) {
        console.log('scrolled')
        animateScroll.scrollToBottom({
            containerId: divId
        })
    }

    async changeChat(newChat) {
        if (newChat._id === this.state.selectedChat._id) return;
        await messageServices.getChatMessages(
            (newChat._id), 
            (JSON.parse(localStorage.getItem("user"))._id),
            (chat) => {
                console.log(chat)
                this.setState({
                    ...this.state,
                    selectedChat: {
                        ...newChat,
                        ...chat
                    }
                }, () => {
                    console.log("\nAfter updating\n")
                    console.log(this.state)
                })
                console.log(this.state);
            },
            (err) => {
                axios.post('/echo', {locatoin: "messageContainer.js", err: err, line: "134", state: this.state});
                console.log(err)
            }
        )
    };
    
    onSubmitMessage = (msg) => {
        console.log("New msg");
        console.log("Message : " + msg);
        messageServices.submitNewMessage(
            msg,
            JSON.parse(localStorage.getItem("user"))._id,
            this.state.selectedChat
        );
    }
    
    // chatHeads = () => {

    //     if (chatHeadsLoading) return <div><Loading /></div>;

    //     const changeChat = (newChat) => {
    //         this.changeChat(newChat);
    //     }
    //     const selectedChat = this.state.selectedChat;
    //     // axios.post('/echo', {location: "messageContainer.js", method: "chatHeads", this: this, selectedChat: selectedChat, changeChat: changeChat});
    //     const chatHeadList = this.props.chatHeads.map((ch) => {
    //         return (
    //             <li key={ch._id}>
    //                 <ChatLabel 
    //                     chatHead={ch} 
    //                     onClick={changeChat} 
    //                     isSelected = {ch._id === selectedChat._id}
    //                 />
    //             </li>
    //         );
    //     });
    //     return <ul className="chatList">{chatHeadList}</ul>;
    // }
    
    chatContainer = () => {
        if (Object.keys(this.state.selectedChat).length > 0) {
            // console.log(this.state)
            console.log(this.state.selectedChat)
            console.log("Index: " + this.state.selectedChat.chatIndex)
            const msgs = this.state.selectedChat.Messages.map(msg => {
                // console.log(this.state.selectedChat.index + " " + msg.chatIndex);
                // console.log(this.state.selectedChat.index === msg.chatIndex);
                return (
                    <li key={msg._id}>
                        <Message 
                            message = {msg} 
                            sent = {this.state.selectedChat.chatIndex === msg.chatIndex}
                        />
                    </li>
                )
            })

            const firstName = this.state.selectedChat.chatWith.firstName;
            const lastName = this.state.selectedChat.chatWith.lastName;


            return (
                <div id="chatMsgContainer" className="chatMsgContainer">
                    <ChatTitleBar 
                        chatTitle={firstName + (lastName ? " " + lastName : "")} 
                        className="chatTitleBar"
                    />
                    <ul id="messageListBin" className="messageListBin">
                        {msgs}
                    </ul>
                    <MessageTextField handleSubmit={this.onSubmitMessage} />
                </div>
            );
            // axios.post('/echo', {locatoin: "messageContainer.js", state: "slected", selectedChat});
            /* messageServices.getChatMessages(
                selectedChat._id,
                (chat) => {
                    if (!chat.Messages || chat.Messages.length() === 0) {
                        axios.post('/echo', {locatoin: "messageContainer.js", state: "slected", selectedChat});
                        return (
                            <div className="chatMsgContainer">
                                <MessageTextField handleSubmit={onSubmitMessage} />
                            </div>
                        );
                    } else {
                        axios.post('/echo', {locatoin: "messageContainer.js", state: "chatmsgs"});
                        const Messages = chat.Messages.map(msg => <li key={msg._id}><Message message={msg} /></li>);
                        return (
                            <div className="chatMsgContainer">
                                <ul className="messageListBin">
                                    {Messages}
                                </ul>
                                <MessageTextField handleSubmit={onSubmitMessage} />
                            </div>
                        );
                    }
                },
                (err) => {
                    console.log(err)
                }
            ) */
        } else {
            // axios.post('/echo', {locatoin: "messageContainer.js", state: "not selected", selectedChat})
            return <div className="chatMsgContainer" />
        }
    }

    updateMessage = (...msg) => {
        this.setState({
            ...this.state,
            selectedChat: {
                ...this.state.selectedChat,
                Messages: [...this.state.selectedChat.Messages, ...msg]
            }   
        })
        // axios.post('/echo', {locatoin: "messageContainer.js", state: this.state})
    }

    openNewChatWindow = () => {
        this.setState({
            ...this.state,
            newChatWindowOn: true
        })
    } 

    closeNewChatWindow = () => {
        this.setState({
            ...this.state,
            newChatWindowOn: false
        })
    }

    startANewChat = (otherPersonsId, userId) => {
        const requestedChat = this.state.chatHeads.find(ch => ch.participants.includes(otherPersonsId));
        if (requestedChat) {
            this.changeChat(requestedChat);
        } else {
            messageServices.startNewChat(
                otherPersonsId,
                userId,
                (chat) => {
                    this.setState({
                        ...this.state,
                        chatHeads: [...this.state.chatHeads, chat]
                    });
                    this.changeChat(chat);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    newChatWindow = () => {
        if (this.state.newChatWindowOn) {
            return (
                <NewChatWindow 
                    closeNewChatWindow={this.closeNewChatWindow}
                    startANewChat={this.startANewChat}
                />
            );
        }
    }

    componentDidMount() {
        socket.on("newMessage", (data) => {
            // axios.post('/echo', {locatoin: "messageContainer.js", line: "190", state: "newMsg", "data": data});
            // console.log
            if (data.chatId === this.state.selectedChat._id){
                this.updateMessage(data.msg)
            }
            console.log("newMessage192")
        });

        this.setState({
            ...this.state,
            chatHeadsLoading: true
        });
        messageServices.getAllChats(
            JSON.parse(localStorage.getItem("user"))._id,
            (chats) => this.setState({
                ...this.state,
                chatHeads: chats,
                chatHeadsLoading: false
            }),
            (err) => {
                this.setState({
                    ...this.state,
                    chatHeadsLoading: false
                });
                console.log(err);
            }
        );
    }

    async componentDidUpdate() {
        // const selectedChat = this.state.selectedChat
        // if (this.state.selectedChat && Object.keys(this.state.selectedChat).length > 0) {
        //     // axios.post('/echo', {locatoin: "messageContainer.js", line: "115", state: this.state});
        //     await messageServices.getChatMessages(
        //         (this.state.selectedChat._id),
        //         (chat) => {
        //             /* if (!chat.Messages || chat.Messages.length() === 0) {
        //                 // axios.post('/echo', {locatoin: "messageContainer.js", state: "slected", selectedChat});
        //                 return (
        //                     <div className="chatMsgContainer">
        //                         <MessageTextField handleSubmit={this.onSubmitMessage} />
        //                     </div>
        //                 );
        //             }  */
        //             if (chat.Messages && chat.Messages.length() > 0) {
        //                 // 
        //                 // const Messages = chat.Messages.map(msg => <li key={msg._id}><Message message={msg} /></li>);
        //                 // return (
        //                 //     <div className="chatMsgContainer">
        //                 //         <ul className="messageListBin">
        //                 //             {Messages}
        //                 //         </ul>
        //                 //         <MessageTextField handleSubmit={this.onSubmitMessage} />
        //                 //     </div>
        //                 // );
        //                 this.updateMessage(...chat.Messages);
        //                 axios.post('/echo', {locatoin: "messageContainer.js", line: "134", state: this.state});
        //             }
        //         },
        //         (err) => {
        //             axios.post('/echo', {locatoin: "messageContainer.js", err: err, line: "134", state: this.state});
        //             console.log(err)
        //         }
        //     )
        // }
        
        this.scrollToBottom("messageListBin");
        socket.on('uncaughtException', function (exception) {
            // handle or ignore error
            console.log(exception);
        });
    }

    render() {
        return (
            <div className="messageContainer">
                <div className="chatContainer">
                    <ChatToolsBar newChatWindowOn={this.state.newChatWindowOn} openNewChatWindow={this.openNewChatWindow}/>
                    {this.newChatWindow()}
                    {/* <ul className="chatList">
                        {this.chatHeads()}
                    </ul> */}
                    <ChatHeads 
                        isLoading={this.state.chatHeadsLoading}
                        selectedChat={this.state.selectedChat}
                        chatHeads={this.state.chatHeads}
                        changeChat={this.changeChat.bind(this)}
                    />
                </div>
                {this.chatContainer()}
            </div>
        );
    }
}

export default MessageContainer;