const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');

const router = express.Router();

module.exports = router;
