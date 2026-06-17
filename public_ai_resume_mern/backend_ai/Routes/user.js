const express = require("express");
const router = express.Router();
const UserController = require('../Controllers/user');

router.post('/login', UserController.login);

module.exports = router;