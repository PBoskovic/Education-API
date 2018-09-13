const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

router
  .post('/register', catchAsyncError(UserController.register))
  .post('/signin', catchAsyncError(UserController.signIn))
  .post('/reset-token', catchAsyncError(UserController.generateResetToken))
  .post('/reset-password/:resetToken', catchAsyncError(UserController.resetPassword))
  .post('/change-password', authCheck, catchAsyncError(UserController.changePassword));

module.exports = router;
