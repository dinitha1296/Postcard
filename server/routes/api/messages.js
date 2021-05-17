const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID;

const User = require('../../models/user');
const Chat = require('../../models/chat');
const Messages = require('../../models/message')
const ensureAuthenticated = require('../../middleware/auth');
const { json } = require('body-parser');

router.post('/new-chat', ensureAuthenticated, (req, res) => {
    const participants = req.body.participants.map(id => ObjectID(id))
    const userId = req.body.userId;
    const otherPersonId = participants.find(id => id != userId);
    Chat.findOne({$and: [
        {participants: {$all: participants}},
        {participants: {$size: participants.length}}]}, (err, chat) => {
        if (err) {
            res.status(400).json({errorMsg: 'Error retrieving the chat', error: err});
        } else if (chat) {
            res.status(400).json({errorMsg: 'Chat already exists', error: err})
        } else {
            Chat.create({
                participants: participants
            }, (err, chat) => {
                if (err) {
                    res.status(400).json({errorMsg: "Error creating the chat", error: err});
                } else {
                    for (id of participants) {
                        User.updateOne({
                            _id: id
                        }, {
                            $push: {
                                chats: {
                                    id: chat._id,
                                    index: participants.indexOf(id)
                                }
                            }
                        }, null,
                        (err, user) => {
                            if (err) {
                                console.log(err)
                                res.status(400).json({errorMsg: "User not found", error: err})
                            }
                        })
                    }
                    if (!res.status) {
                        res.status(400).json({errorMsg: "Users not updated"});
                    } else {
                        User.findOne({_id: otherPersonId}, (err, otherUser) => {
                            if (err) {
                                res.status(400).json({errorMsg: "Something went wrong", error: err});
                            } else if (!otherUser) {
                                res.status(400).json({errorMsg: "User not found"});
                            } else {
                                chat._doc.chatWith = {
                                    _id: otherUser._doc._id,
                                    username: otherUser._doc.username,
                                    firstName: otherUser._doc.firstName,
                                    lastName: otherUser._doc.lastName,
                                    blocked: otherUser._doc.blocked
                                }
                                chat._doc.index = participants.indexOf(userId);
                                chat._doc.lastMsg = null;
                                res.status(200).json(chat);                             
                            }
                        })
                    }
                }
            })
        }
    });
})

router.get('/search-users', ensureAuthenticated, (req, res) => {
    if (req.query.username == "99all99") {
        User.find({}, (err, users) => {
            console.log(req.query.username);
            console.log(users);
            if (err) {
                console.log(err);
                res.json({error: "Error searching the user"})
            } else if (!users) {
                res.json({matchedUser: null})
            } else {
                const output = users.map(user => {
                    return ({
                        username: user.username,
                        id: user._id,
                        name: (user.firstName ? user.firstName + " " : "") + user.lastName
                    });
                });
                res.json({
                    matchedUser: output
                });
            }
        });
    } else {
        User.findOne({username: req.query.username}, (err, user) => {
            console.log(req.query.username);
            console.log(user);
            if (err) {
                console.log(err);
                res.json({error: "Error searching the user"})
            } else if (!user) {
                res.json({matchedUser: null})
            } else {
                res.json({
                    matchedUser: {
                        username: user.username,
                        id: user._id,
                        name: (user.firstName ? user.firstName + " " : "") + user.lastName
                    }
                });
            }
        });
    }
})

/*
{
    "participants": ["60587696b1fbe0081824c6b2", "603628a8cd88d42394e8ca2b"],
    "initiator": "60587696b1fbe0081824c6b2"
}
{
    "password": "dinitha1234",
    "username": "dinitha1234"
}
*/

router.get('/all-chats', ensureAuthenticated, (req, res) => {
    User.findOne({_id: req.query.userId}, (err, user) => {
        if (err) {
            return next(err);
        } else if (!user) {
            res.status(400).json({ error: "Incorrect user ID"});
        } else {
            console.log(user);
            const chatIds = user.chats.map(obj => obj.id)
            Chat.aggregate(
                [
                    {$match: {_id: {$in: chatIds}}},
                    {$addFields: {
                        "chatWith": {$first: {$filter: 
                            {
                                input: "$participants",
                                as: "id",
                                cond: {$not: {$eq: ["$$id", user._id]}}
                            }
                        }},
                        "lastMsg": {$last: "$Messeges"}
                    }},
                    {$lookup: {
                        from: "users",
                        localField: "chatWith",
                        foreignField: "_id",
                        as: "chatWith"
                    }},
                    {$addFields: {
                        "chatWith": {$first: "$chatWith"}
                    }},
                    {$project: {
                        "chatWith.inbox": 0, 
                        "chatWith.sent": 0, 
                        "chatWith.starred": 0,
                        "chatWith.snooze": 0, 
                        "chatWith.spam": 0,
                        "chatWith.chats": 0,
                        "chatWith.password": 0,
                        "chatWith.__v": 0,
                    }}
                ],
                (err, chats) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ error: "Error obtaining user data" });
                    } else {
                        console.log(chats);
                        for (let chat of chats) {
                            const c = user.chats.find((ch) => Object.values(ch.id)[0] == Object.values(chat._id)[0]);
                            chat.index = c.index;
                        }
                        console.log(chats.chatWith);
                        res.json({chats});
                    }
                }
            )
        }
    });
})

router.post('/chat', ensureAuthenticated, (req, res) => {
    console.log("Chat req : " + req.body.chatId); 
    Chat.findOne({_id: req.body.chatId}, (err, chat) => {
        if (err) {
            console.log("Error: at /chat");
            console.log(err)
            res.status(400).json({error: "Error retrieving the chat"});
        } else if (!chat) {
            console.log("No chat found");
            res.status(400).json({error: "Chat couldn't be found"});
        } else {

            if (chat.Messages && chat.Messages.length > 0) {
                Messages.aggregate(
                    [
                        {$match: {_id: {$in: chat.Messages}}},
                    ],
                    (err, messages) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ error: "Error obtaining user data" });
                        } else {
                            const chatIndex = (chat._doc.participants.indexOf(req.body.userId));
                            const updatedMessages = messages
                                .filter(msg => msg.body || chatIndex !== msg.chatIndex)
                                .map(msg => {
                                    if (msg.delete_for.includes(req.body.userId)) {
                                        return {...msg, body: ""};
                                    }
                                    return msg;
                                });

                            chat._doc.Messages = updatedMessages;
                            chat._doc.chatIndex = chatIndex;
                            res.status(200).json(chat);
                            console.log("\nChat found\n")
                        }
                    }
                )
            } else {
                res.status(200).json(chat);
            }
        }
    })
});

module.exports = router;