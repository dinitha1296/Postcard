import axios from "axios";
import { Service } from "axios-middleware";

import socket from "./socket";
import userServices from "./user.services";
import store from "../store";
import { logoutAction } from "../actions/authActions";

const service = new Service(axios);

service.register({
    onResponseError(error) {
        const re = JSON.parse(error.response.data);
        console.log(re && re.logout);
        if (re && re.logout) {
            userServices.logout((data) => {
                store.dispatch(logoutAction());
            }, (err) => {});
        }
    }
});

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
    });
}

const deleteMessage = (msgId, userId, chatId, deleteForAll) => {
    socket.emit("deleteMessage", {
        msgId,
        userId,
        chatId,
        deleteForAll
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
    deleteMessage,
    searchNewUsers,
    getAllChats,
    startNewChat
}

export default messageServices;