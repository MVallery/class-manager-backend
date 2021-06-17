const express = require('express');
const { check }  = require('express-validator');
const usersControllers = require('./users-controllers')
const HttpError = require('./http-error');
const router = express.Router();

router.post('/:uid/create-class', usersControllers.createClass)

router.get('/:uid', usersControllers.getUserById)


router.patch('/:uid/:cid', usersControllers.updateClass)
router.delete('/:uid/:cid', usersControllers.deleteClass)

router.post('/signup', usersControllers.signUp)


router.post('/login', usersControllers.login)
router.post('/googlelogin', usersControllers.googleLogin)

module.exports = router;