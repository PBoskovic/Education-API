const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');

const router = express.Router();

router
  .post('/register', catchAsyncError(UserController.register));

module.exports = router;
