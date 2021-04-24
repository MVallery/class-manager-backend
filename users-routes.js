const express = require('express');

const usersControllers = require('./users-controllers')
const HttpError = require('./http-error');
const router = express.Router();

router.get('/:uid', usersControllers.getUserById)

router.post('/:uid/create-class', usersControllers.createClass)

router.patch('/:uid/:cid', usersControllers.updateClass)
router.delete('/:uid/:cid', usersControllers.deleteClass)

router.post('/signup', usersControllers.signUp)


router.post('/login', usersControllers.login)
module.exports = router;