const express = require("express");
const { signUp, signIn, userInfo, logout } = require("../controller/controller");
const jwtAuth = require('../middleware/jwtAuth.js');
const router = express.Router();

router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/userInfo',jwtAuth,userInfo)
router.get('/logout',jwtAuth,logout)

module.exports = router;