const express = require('express');
const SchoolController = require('./schoolController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');


const router = express.Router();

router
  .post('/school', authCheck, catchAsyncError(SchoolController.addSchool));

module.exports = router;
