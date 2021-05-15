const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const bodyparser = require("body-parser");

const User = require("../../models/user");
const Chat = require("../../models/chat");
const { ObjectID } = require("mongodb");
const chat = require("../../models/chat");

router.post('/register', (req, res, next) => {
    
    console.log(req.body);
    const hash = bcrypt.hashSync(req.body.password, 12);

    User.findOne({"username": req.body.username}, (err, user) => {
        console.log('Tried creating a user');
        if (err) {
            next(err);
        } else if (user) {
            res.status(400).json({error: 'Username already in use. Try with a different username.'});
        } else {
            User.create({
                username: req.body.username,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }, (err, doc) => {
                if (err) {
                    res.status(400).json({error: 'Error in creating user object. Database error.'});
                } else {
                    req.userDetails = doc;
                    next(null, doc);
                }
            });
        }
    });

}, passport.authenticate('local', {failureRedirect: '/'}), (req, res, next) => {
    console.log('Authentication successfull')
    res.status(200).json({messege: 'User created', user: req.userDetails});
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({messaage: "Logout successful"});
})

router.post('/login', (req, res, next) => {

    console.log("Tried logging in");

    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            // console.log("An error occured");
            return next(err);
        } else if (!user) {
            // console.log("Incorrect username: " + req.body.username);
            res.status(400).json({ error: "Incorrect username"});
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            // console.log("Incorrect password: " + req.body.password);
            res.status(400).json({ error: "Incorrect password" })
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
                        console.log(chat);
                        for (let chat of chats) {
                            const c = user.chats.find((ch) => Object.values(ch.id)[0] == Object.values(chat._id)[0]);
                            chat.index = c.index;
                        }
                        console.log(chats.chatWith);
                        user.chats = chats;
                        /* for (ch in chat) {
                            ch.chatHeader = ch.chatHeader[0][0].username
                        }  */
                        delete user.password;
                        delete user.__v;
                        if (chats) {
                            /* console.log(typeof chats[0].chatWith)
                            console.log("ChatHeader : " + (chats[0].chatHeader[0]))
                            console.log(typeof chats[0].participants[0]) */
                            // console.log(chats[0])
                        }
                        console.log("user found");
                        req.userDetails = user;
                        next(null, user);
                    }
                }
            )
        }
    });
    
}, passport.authenticate('local', {failureRedirect: '/'}), (req, res, next) => {
    // console.log("res");
    res.status(200).json({message: 'Successfully logged in', user: req.userDetails})
    // res.redirect('/messages')
});

module.exports = router;