'use strict'
// importing
const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');
const socketio = require('socket.io');
const socketObj = require('./socket');
const cors = require('cors');
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});
require('dotenv').config();

const myDB = require('./connection.js');
const routes = require('./routes');

// app configuration
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());
app.use(expressSession);

require('./configure/auth')(app);
app.use(passport.initialize());
app.use(passport.session());

// db config
myDB(async client => {

    // const emailCollection = await client.db('postcard').collection('emails');
    // const emailAtcCollection = await client.db('postcard').collection('emailAtcs');
    // const users = await client.db('postcard').collection('users');

    // app.get('/hello', (req, res) => {
    //     console.log('Hello req recieved');
    //     res.json({message: 'hello'});
    // })

    // app.use(routes);
});

// ????

// api routes
app.use('/', routes);

app.get('/hello', (req, res) => {
    console.log('Hello req recieved');
    res.json({message: 'hello'});
})

app.post('/echo', (req, res) => {
    console.log('\nEcho\nUser:')
    console.log(req.body);
    res.status(200);
})

// listen
const server = app.listen(port, () => console.log(`Listning on localhost: ${port}`));

const io = socketio(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const onlineUsers = {};
const rooms = {};

io.on('connection', socketObj(onlineUsers, rooms, io));