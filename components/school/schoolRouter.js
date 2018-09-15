const express = require('express');
const SchoolController = require('./schoolController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { authCheck } = require('../../middlewares/authCheck');


const router = express.Router();

router
  .put('/school/:schoolId', authCheck('SuperAdmin'), catchAsyncError(SchoolController.editSchool))
  .get('/school/:schoolId', authCheck('SuperAdmin'), catchAsyncError(SchoolController.getSingleSchool))
  .get('/school', authCheck('SuperAdmin'), catchAsyncError(SchoolController.getAllSchools))
  .post('/school', authCheck('SuperAdmin'), catchAsyncError(SchoolController.addSchool));

module.exports = router;
