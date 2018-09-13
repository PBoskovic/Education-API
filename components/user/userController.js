const { User } = require('../../models');
const { issueNewToken } = require('../../lib/tokenHandler');
const error = require('../../middlewares/errorHandling/errorConstants');

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
