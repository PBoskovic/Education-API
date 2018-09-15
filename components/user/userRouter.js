const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

router
  .get('/school/:schoolId/user', authCheck('Admin'),catchAsyncError(UserController.getAllUsers))
  .get('/user', authCheck('SuperAdmin'), catchAsyncError(UserController.getAllUsersForSuperAdmin));

module.exports = router;
