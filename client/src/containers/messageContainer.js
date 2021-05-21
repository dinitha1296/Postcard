import React from "react";
import { animateScroll } from "react-scroll";
import { connect } from "react-redux"

import Message from "../componenets/messageComponenets/message";
import MessageTextField from "../componenets/messageComponenets/messageTextField";
import ChatLabel from "../componenets/messageComponenets/chatLabel";
import ChatTitleBar from "../componenets/messageComponenets/chatTitleBar";
import ChatToolsBar from "../componenets/messageComponenets/chatToolsBar";
import NewChatWindow from "../componenets/messageComponenets/newChatWindow";
import Loading from "../componenets/loading";
import "./messageContainer.css";
import messageServices from "../services/messages.services";
import socket from "../services/socket";


const ChatHeads = (props) => {
    
    if (props.isLoading) return <div className="chatHeadLoadingDiv"><Loading /></div>;

    const changeChat = (newChat) => {
        props.changeChat(newChat);
    }

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
                console.log(err)
            }
        )
    };
    
    onSubmitMessage = (msg) => {
        messageServices.submitNewMessage(
            msg,
            JSON.parse(localStorage.getItem("user"))._id,
            this.state.selectedChat
        );
    }
    
    chatMsgContainer = (style) => {
        if (Object.keys(this.state.selectedChat).length > 0) {
            const msgs = this.state.selectedChat.Messages.map(msg => {
                const sent = this.state.selectedChat.chatIndex === msg.chatIndex;
                if (msg.body === "" && sent) return null;
                return (
                    <li key={msg._id}>
                        <Message 
                            message = {msg} 
                            sent = {sent}
                            onDelete = {this.deleteMessage}
                            chatId = {this.state.selectedChat._id}
                        />
                    </li>
                )
            })

            const firstName = this.state.selectedChat.chatWith.firstName;
            const lastName = this.state.selectedChat.chatWith.lastName;


            return (
                <div id="chatMsgContainer" className="chatMsgContainer" style={style}>
                    <ChatTitleBar 
                        chatTitle={firstName + (lastName ? " " + lastName : "")} 
                        className="chatTitleBar"
                        isMobile={this.props.isMobile}
                        onBack={this.onBack}
                    />
                    <ul id="messageListBin" className="messageListBin">
                        {msgs}
                    </ul>
                    <MessageTextField handleSubmit={this.onSubmitMessage} />
                </div>
            );
        } else {
            return <div className="chatMsgContainer" style={style}/>
        }
    }

    messageContainer = (style) => {
        return (
            <div className="chatContainer" style={style}>
                <ChatToolsBar newChatWindowOn={this.state.newChatWindowOn} openNewChatWindow={this.openNewChatWindow}/>
                {this.newChatWindow()}
                <ChatHeads 
                    isLoading={this.state.chatHeadsLoading}
                    selectedChat={this.state.selectedChat}
                    chatHeads={this.state.chatHeads}
                    changeChat={this.changeChat.bind(this)}
                />
            </div>
        );
    }

    updateMessage = (...msg) => {
        this.setState({
            ...this.state,
            selectedChat: {
                ...this.state.selectedChat,
                Messages: [...this.state.selectedChat.Messages, ...msg]
            }   
        })
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
        return (
            this.state.newChatWindowOn && 
            <NewChatWindow 
                closeNewChatWindow={this.closeNewChatWindow}
                startANewChat={this.startANewChat}
            />
        );
    }

    deleteMessage = (chatId, msgId, deleteForAll) => {
        const userID = localStorage.getItem('userId');
        messageServices.deleteMessage(msgId, userID, chatId, deleteForAll);
    }

    updateDeletedMessage = (msgId) => {
        const msgIndex = this.state.selectedChat.Messages.findIndex(msg => msg._id === msgId);
        if (msgIndex === -1) return;
        const message = JSON.parse(JSON.stringify(this.state.selectedChat.Messages[msgIndex]));
        message.body = '';
        this.setState({
            ...this.state,
            selectedChat: {
                ...this.state.selectedChat,
                Messages: [
                    ...this.state.selectedChat.Messages.slice(0, msgIndex),
                    message, ...this.state.selectedChat.Messages.slice(msgIndex + 1)
                ]
            }
        });
    }

    componentDidMount() {
        socket.on("newMessage", (data) => {
            if (data.chatId === this.state.selectedChat._id) {
                this.updateMessage(data.msg);
            }
        });

        socket.on('deletedMessage', data => {
            console.log("Deleted message");
            if (data.chatId === this.state.selectedChat._id) {
                this.updateDeletedMessage(data.msgId);
            }
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
        
        this.scrollToBottom("messageListBin");
        socket.on('uncaughtException', function (exception) {
            console.log(exception);
        });
    }

    chatSelected = () => Object.keys(this.state.selectedChat).length !== 0;

    selectWidth = () => this.props.isMobile ? {width: "100%"} : null;

    onBack = () => this.setState({...this.state, selectedChat: {}});

    render() {
        console.log(window.innerWidth);
        return (
            <div className="messageContainer">
                {(!this.props.isMobile || !this.chatSelected()) && this.messageContainer(this.selectWidth())}
                {(!this.props.isMobile || this.chatSelected()) && this.chatMsgContainer(this.selectWidth())}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isMobile: state.isMobile
    }
}

export default connect(mapStateToProps)(MessageContainer);