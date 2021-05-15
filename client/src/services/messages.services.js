import axios from "axios";
// import openSocket from "socket.io-client"
import socket from "./socket";

// const socket = openSocket()

const getAllChats = (userId, next, err) => {
    axios
        .get('api/messages/all-chats', {params: {userId}})
        .then(res => next(res.data.chats))
        .catch(error => err(error));
}

const getChatMessages = (chatId, userId, next, err) => {
    axios
        .post('api/messages/chat', {
            chatId: String(chatId),
            userId: String(userId)
        }) 
        .then(res => {
            console.log("\nChat succesfully recieved\n");
            next(res.data);
        })
        .catch(error => {
            console.log("\nERROR\n")
            console.log(error)
            axios.post('/echo', {locatoin: "message.services.js", status: "error", req: error.request})
            axios.post('/echo', {locatoin: "message.services.js", status: "error", res: error.response})
        });
}

const submitNewMessage = (msg, userId, chat) => {
    console.log("New message");
    console.log('Msg : ' + msg);
    console.log('User Id : ' + userId);
    console.log('Chat : ' + chat);
    socket.emit("submitMessage", {
        user: userId,
        chat: chat,
        message: msg
    })
}

const searchNewUsers = (username, next, err) => {
    axios
        .get('api/messages/search-users', {params: {username}})
        .then(res => {
            console.log(res.data);
            next(res.data);
        })
        .catch(error => {
            err(error);
        });
}

const startNewChat = (otherPersonsId, userId, next, err) => {
    axios
        .post('api/messages/new-chat', {participants: [userId, otherPersonsId], userId: userId})
        .then(res => {
            next(res.data)
        })
        .catch(error => err(error));
}

const messageServices = {
    getChatMessages,
    submitNewMessage,
    searchNewUsers,
    getAllChats,
    startNewChat
}

export default messageServices;