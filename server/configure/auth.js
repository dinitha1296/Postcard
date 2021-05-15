require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local');

const User = require('../models/user.js');
const Chat = require('../models/chat.js')

module.exports = function(app) {

    passport.serializeUser((user, done) => {
        console.log("User :" + user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log("Id :" + id);
        User.findOne({_id: id}, (err, doc) => {
            console.log("Doc :" + doc);
            done(null, doc);
        });
    });

    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) return done(null, false);
            if (!user) return done(null, false);
            if (!bcrypt.compareSync(password, user.password)) return done(null, false);
            // console.log(user);
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
                        "chatWith.__v": 0
                    }}
                ],
                (err, chats) => {
                    if (err) {
                        // console.log(err);
                        done(null, false);
                    } else {
                        for (let chat of chats) {
                            const c = user.chats.find((ch) => Object.values(ch.id)[0] == Object.values(chat._id)[0]);
                            chat.index = c.index;
                        }
                        user.chats = chats;
                        /* for (ch in chat) {
                            ch.chatHeader = ch.chatHeader[0][0].username
                        }  */
                        if (chats) {
                            /* console.log(typeof chats[0].chatWith)
                            console.log("ChatHeader : " + (chats[0].chatHeader[0]))
                            console.log(typeof chats[0].participants[0]) */
                            // console.log(chats[0])
                        }
                        console.log("user found in authentication");
                        done(null, user);
                    }
                }
            )
        });
    }));
}