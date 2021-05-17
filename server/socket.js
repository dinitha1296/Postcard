const { ObjectID } = require('bson');
const Chat = require('./models/chat');
const Message = require('./models/message');

const socket = (users, rooms, io) => socket => {

    // console.log(`New client id:${socket.id} connected`);

    socket.on('logged', data => {
        console.log("Logged")

        const chatIds = data.chats.map(chat => chat._id);

        users[socket.id] = {
            id: data.userId,
            chats: chatIds
        }

        console.log("Users :");
        console.log(users);
        console.log("Data :");
        console.log(data);

        for (let chat of data.chats) {
            
            const user = {
                userId: data.userId,
                socketId: socket.id
            }

            console.log("socket.js 31 Chat id: " + chat._id)
            socket.join(chat._id);

            if (rooms[chat._id]) {
                if (rooms[chat._id].findIndex(obj => obj.userId == user.userId) == -1) {
                    rooms[chat._id].push(user);
                }
            } else {
                rooms[chat._id] = [user]
            }
        }

        console.log("Rooms :");
        console.log(rooms);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected')
        if (users[socket.id]) {
            const user = users[socket.id];
            for (chatId of user.chats) {
                if (rooms[chatId] && rooms[chatId].length == 1) {
                    delete rooms[chatId]
                } else if (rooms[chatId] && rooms[chatId].length > 1) {
                    rooms[chatId] = rooms[chatId].filter(userObj => userObj.userId == user.id)
                }
            }
            delete users[socket.id]
        }
        console.log("Users :");
        console.log(users);
        console.log("Rooms :");
        console.log(rooms);
    })

    socket.on('submitMessage', data => {
        console.log('New message');
        console.log(data);
        console.log(socket.id);
        Message.create({
            body: data.message,
            date: new Date(),
            sender: ObjectID(data.user),
            chatIndex: data.chat.participants.indexOf(data.user),
            delete_for: []
        }, (err, msg) => {
            if (err) {
                console.log("Error : " + err)
            } else {
                Chat.updateOne({
                    _id: data.chat._id
                }, {
                    $push: {Messages: ObjectID(msg._id)}
                }, null,
                (error, chat) => {
                    if (!err) {
                        console.log("Successfully updated");
                        // console.log(chat);
                        io.to(data.chat._id).emit("newMessage", {msg, chatId: data.chat._id});
                    } else {
                        console.log("Updata error" + error)
                    }
                })
            }
        })
    })

    socket.on('deleteMessage', async data => {
        const userConfirmed = users[socket.id].id === data.userId;
        const chatConfirmed = users[socket.id].chats.includes(data.chatId);
        if (!userConfirmed || !chatConfirmed) return;

        const chat = await Chat.findById(data.chatId);
        const message = await Message.findById(data.msgId)
        if (!message.body) return;

        const chatIndex = chat.participants.indexOf(data.userId);
        const isOwner = chatIndex === message.chatIndex;
        if (!isOwner && data.deleteForAll) return;

        if (data.deleteForAll) {
            await Message.updateOne(
                {_id: message._id},
                {$set: {body: '', delete_for: []}});
            
            io.to(data.chatId).emit("deletedMessage", {
                chatId: data.chatId,
                msgId: data.msgId
            });
        } else {
            if (message.delete_for.includes(data.userId)) return
            await Message.updateOne(
                {_id: message._id},
                {$set: {delete_for: [message.delete_for, data.userId]}}
            );
            
            io.to(socket.id).emit("deletedMessage", {
                chatId: data.chatId,
                msgId: data.msgId
            });
        }
    });

    socket.on('uncaughtException', function (exception) {
        // handle or ignore error
        console.log(exception);
    });

    // socket.on("new-user", async user => {
    //     console.log("new-user: ", user.username);

    //     socket.broadcast.emit("user-connected", user);
    // });
  
    // socket.on("disconnect", async () => {
    //     const user = await User.findOneAndUpdate(
    //         { status: socket.id },
    //         { status: "" },
    //         { useFindAndModify: false }
    //     );

    //     console.log("user-disconnect: ", user.username);
    //     socket.broadcast.emit("user-disconnected", user);
    // });
  
    // socket.on("user-offline", async () => {
    //     const user = await User.findOneAndUpdate(
    //         { status: socket.id },
    //         { status: "" },
    //         { useFindAndModify: false }
    //     );

    //     console.log("user-disconnect: ", user.username);
    //     socket.broadcast.emit("user-disconnected", user);
    // });
  
    // socket.on("broadcast-message", async msgObj => {
    //     // console.log("broadcast-message: ", msgObj);
    //     socket.broadcast.emit("new-message", msgObj);
    // });
};
  
module.exports = socket;