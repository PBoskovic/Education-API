const { User } = require('../../models');
const { issueNewToken } = require('../../lib/tokenHandler');
const error = require('../../middlewares/errorHandling/errorConstants');
const bcrypt = require('bcrypt');
const { customShortId } = require('../../lib/misc');
/**
 * @api {post} /register Register User
 * @apiVersion 1.0.1
 * @apiName Register
 * @apiDescription Register User
 * @apiGroup User
 *
 * @apiParam {String} firstName First name
 * @apiParam {String} lastName Last name
 * @apiParam {String} age Age
 * @apiParam {String} email Email
 * @apiParam {String} school School of the student
 * @apiParam {String} schoolClass Class of the student
 * @apiParam {String} phoneNumber Phone number
 * @apiParam {String} password Password
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
  "message":"Successfully registered.",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ",
  "results":{
    "isActive":true,
    "_id":"5b9a794a2c9f483614b1398f",
    "firstName":"Mr. Marielle Bernier",
    "lastName":"O'Kon",
    "age":"69",
    "email":"freddy.weimann50@gmail.com",
    "school":"Kuphal and Sons",
    "schoolClass":"Grocery",
    "phoneNumber":"1-724-133-5505 x0421",
    "createdAt":"2018-09-13T14:50:50.117Z",
    "updatedAt":"2018-09-13T14:50:50.117Z",
    "__v":0
  }
}
 * @apiUse MissingParamsError
 */
module.exports.register = async (req, res) => {
  const { firstName, lastName, age, email, school, schoolClass, phoneNumber, password, role } = req.body;

  if (!firstName || !lastName || !age || !email || !password || !role) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  const user = await new User({
    firstName,
    lastName,
    age,
    email,
    school,
    schoolClass,
    phoneNumber,
    password,
    role,
  }).save();
  user.password = undefined;

  return res.status(200)
    .send({
      message: 'Successfully registered.',
      token: issueNewToken({ _id: user._id }),
      results: user,
    });
};

/**
 * @api {post} /signin Sign in User
 * @apiVersion 1.0.1
 * @apiName Sign in
 * @apiDescription Sign in User
 * @apiGroup User
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message":"Successfully signed in.",
   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
   "results":{
      "_id":"5b9a93e914219d62d0034ade",
      "isActive":true,
      "firstName":"Skyla Schroeder",
      "lastName":"Pfeffer",
      "age":"28",
      "email":"judah.kuhn14@gmail.com",
      "school":"Gleichner, Lueilwitz and Bergnaum",
      "schoolClass":"Music",
      "phoneNumber":"(980) 271-5579",
      "createdAt":"2018-09-13T16:44:25.286Z",
      "updatedAt":"2018-09-13T16:44:25.286Z",
      "__v":0
   }
}

 * @apiUse MissingParamsError
 * @apiUse NotFound
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  // Throwing error if parameters were not provided
  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Finding the user
  const user = await User
    .findOne(
      { email: email.toLowerCase() })
    .select('+password')
    .lean();

  // Throwing error if user does not exist
  if (!user) {
    throw new Error(error.NOT_FOUND);
  }

  // Throwing error if user is inactive
  if (!user.isActive) {
    throw new Error(error.FORBIDDEN);
  }

  // Compare password input with user db password
  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error(error.CREDENTIALS_ERROR);
  }

  delete user.password;

  // Generate new token and return user
  return res.status(200).send({
    message: 'Successfully signed in.',
    token: issueNewToken({
      _id: user._id,
    }),
    results: user,
  });
};

/**
 * @api {post} /reset-token Reset token
 * @apiVersion 1.0.1
 * @apiName generateResetToken
 * @apiDescription Sends an email with the token to reset the password
 * @apiGroup User
 *
 * @apiParam {String} email Email
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message": "Successfully generated reset token"
 }
 * @apiUse MissingParamsError
 */
module.exports.generateResetToken = async (req, res) => {
  const { email } = req.body;

  // Throwing error if email was not provided
  if (!email) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Generating resetToken
  const resetToken = customShortId();

  // Finding the user
  const user = await User
    .findOne({ email: email.toLowerCase() })
    .lean();

  // Throwing error if user is not found
  if (!user) {
    throw new Error(error.NOT_FOUND);
  }

  // Update user with new resetToken
  await User.update(
    { email },
    { $set: { resetToken } });

  return res.status(200).send({
    message: 'Successfully generated reset token',
  });
};

/**
 * @api {post} /reset-password/:resetToken Reset password
 * @apiVersion 1.0.1
 * @apiName resetPassword
 * @apiDescription Resets the password if the token is valid
 * @apiGroup User
 *
 * @apiParam {String} password New password
 * @apiParam {String} resetToken ResetToken
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message": "Password updated",
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 }
 * @apiUse MissingParamsError
 * @apiUse NotFound
 */
module.exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  // Throwing error if parameters were not provided
  if (!password || !resetToken) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Finding the user with given tokeb
  const user = await User
    .findOne({ resetToken })
    .lean();

  // Throwing error if user is not found
  if (!user) {
    throw new Error(error.NOT_FOUND);
  }

  // Hashing new password
  const newPassword = bcrypt.hashSync(password, 10);

  // Updating user with new password and clearing resetToken
  await User.update({ resetToken }, {
    $set: { password: newPassword },
    $unset: { resetToken: '' },
  });

  return res.status(200).send({
    message: 'Password updated',
    token: issueNewToken({
      _id: user._id,
    }),
  });
};

/**
 * @api {post} /change-password Change password
 * @apiVersion 1.0.1
 * @apiName changePassword
 * @apiDescription Changing password for logged in user
 * @apiGroup User
 *
 * @apiParam {String} oldPassword User's old password
 * @apiParam {String} newPassword User's new password to set to
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message": "Password successfully updated"
 }
 * @apiUse MissingParamsError
 * @apiUse NotFound
 */
module.exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;

  // Throwing error if parameters were not provided
  if (!oldPassword || !newPassword) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Finding current logged in user
  const user = await User
    .findOne(
      { _id },
      { password: 1 })
    .lean();

  // Throwing error if old password is not the same as the one in db
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new Error(error.CREDENTIALS_ERROR);
  }

  // Hashing new password
  const password = bcrypt.hashSync(newPassword, 10);

  // Updating user with new password
  await User.update(
    { _id },
    { $set: { password } });

  return res.status(200).send({
    message: 'Password successfully updated',
  });
};
