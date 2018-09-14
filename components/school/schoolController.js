const { School } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {post} /school Add new school
 * @apiVersion 1.0.1
 * @apiName addSchool
 * @apiDescription Add new school
 * @apiGroup School
 *
 * @apiParam {String} name School name
 * @apiParam {String} address School address
 * @apiParam {String} city School city
 * @apiParam {String} contactNumber School contact
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
  "message":"Successfully added new school",
  "results":{
    "isActive":true,
    "_id":"5b9c286bf2bafb45aa956fa7",
    "name":"Reichel Inc",
    "address":"9352 Agustina Cove",
    "city":"Cassinfurt",
    "contactNumber":"(380) 572-7719 x7621",
    "createdAt":"2018-09-14T21:30:19.716Z",
    "updatedAt":"2018-09-14T21:30:19.716Z",
    "__v":0
  }
}

 * @apiUse MissingParamsError
 */
module.exports.addSchool = async (req, res) => {
  const { name, address, city, contactNumber } = req.body;

  // Throwing error if parameters were not provided
  if (!name || !address || !city) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Creating new school
  const school = await new School({
    name,
    address,
    city,
    contactNumber,
  }).save();

  return res.status(200).send({
    message: 'Successfully added new school',
    results: school,
  });
};
