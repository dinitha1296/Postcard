const router = require('express').Router();

const userRoutes = require('./user');
const emailRoutes = require('./email');
const messagesRoutes = require('./messages');
const { route } = require('./email');

// user routes
router.use('/user', userRoutes);

// email routes
router.use('/email', emailRoutes);

// messages routes
router.use('/messages', messagesRoutes);

module.exports = router;