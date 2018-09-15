const { User } = require('../models/user');
const error = require('../middlewares/errorHandling/errorConstants');

/**
 * Authentication check middleware
 * @param req
 * @param res
 * @param next
 */
module.exports.authCheck = (...allowedRoles) => async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    // Finding the current logged in user
    const user = await User
      .findOne({ _id: req.user._id })
      .lean();

    // Throwing error if user does not exist or inactive
    if (!user || !user.isActive) {
      throw new Error(error.UNAUTHORIZED_ERROR);
    }

    const isAllowed = allowedRoles.includes(user.role);

    // Throwing error if user current role is not allowed on this route
    if (!isAllowed) {
      throw new Error(error.UNAUTHORIZED_ERROR);
    }

    if (user.role !== 'SuperAdmin') {
      if (schoolId && !user.school.equals(schoolId)) {
        throw new Error(error.UNAUTHORIZED_ERROR);
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
