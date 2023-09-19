const express = require("express");
const { signUp, signIn, userInfo, logout, forgotPassword, resetPassword } = require("../controller/controller");
const jwtAuth = require('../middleware/jwtAuth.js');
const router = express.Router();

router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/userInfo',jwtAuth,userInfo)
router.get('/logout',jwtAuth,logout)
router.post('/forgotPassword',forgotPassword)
router.post('/resetPassword',resetPassword)

module.exports = router;