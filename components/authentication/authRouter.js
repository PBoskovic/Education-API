const express = require('express');
const AuthController = require('./authController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

router
  .post('/user/register', catchAsyncError(AuthController.registerUser))
  .post('/admin/register', catchAsyncError(AuthController.registerAdmin))
  .post('/signin', catchAsyncError(AuthController.signIn))
  .post('/reset-token', catchAsyncError(AuthController.generateResetToken))
  .post('/reset-password/:resetToken', catchAsyncError(AuthController.resetPassword))
  .post('/change-password', authCheck('SuperAdmin', 'Admin', 'Student'), catchAsyncError(AuthController.changePassword));

module.exports = router;
