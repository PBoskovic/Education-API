const { User } = require('../models/user');
const error = require('../middlewares/errorHandling/errorConstants');

/**
 * Authentication check middleware
 * @param req
 * @param res
 * @param next
 */
async function authCheck(req, res, next) {
  try {
    const user = await User
      .findOne({ _id: req.user._id })
      .lean();

    if (!user || !user.isActive) {
      throw new Error(error.UNAUTHORIZED_ERROR);
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authCheck,
};
