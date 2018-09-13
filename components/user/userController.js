const { User } = require('../../models');
const { issueNewToken } = require('../../lib/tokenHandler');
const error = require('../../middlewares/errorHandling/errorConstants');

module.exports.register = async (req, res) => {
  const { firstName, lastName, age, email, school, schoolClass, phoneNumber, password } = req.body;

  if (!firstName || !lastName || !age || !email || !password) {
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
  }).save();
  user.password = undefined;

  return res.status(200)
    .send({
      message: 'Successfully registered.',
      token: issueNewToken({ _id: user._id }),
      results: user,
    });
};
