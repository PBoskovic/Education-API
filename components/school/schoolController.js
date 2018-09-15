const { School } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {post} /school Add new school
 * @apiVersion 1.0.1
 * @apiName addSchool
 * @apiDescription Add new school
 * @apiGroup School
 *
 * @apiParam (body) {String} name School name
 * @apiParam (body) {String} address School address
 * @apiParam (body) {String} city School city
 * @apiParam (body) {String} contactNumber School contact
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
 * @apiUse UnauthorizedError
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

/**
 * @api {get} /school Get all schools
 * @apiVersion 1.0.1
 * @apiName getAllSchools
 * @apiDescription Get all schools
 * @apiGroup School
 *
 * @apiParam (query) {String} [skip] Number of schools to skip
 * @apiParam (query) {String} [limit] Number of schools to limit
 * @apiParam (query) {String} [city] City of the schools
 * @apiParam (query) {Boolean} [isActive] Filter by school status
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
  "message":"Successfully got all schools",
  "results":[
    {
      "_id":"5b9c418c2f22c10308cbdad8",
      "isActive":true,
      "name":"Bayer and Sons",
      "address":"29716 Bella Hill",
      "city":"South Cullenstad",
      "contactNumber":"136.747.3691 x4949",
      "__v":0,
      "createdAt":"2018-09-14T23:17:32.704Z",
      "updatedAt":"2018-09-14T23:17:32.704Z"
    },
    {
      "_id":"5b9c418c2f22c10308cbdad9",
      "isActive":true,
      "name":"Schmidt and Sons",
      "address":"40406 Bernier Dale",
      "city":"East Godfreymouth",
      "contactNumber":"(141) 865-3083",
      "__v":0,
      "createdAt":"2018-09-14T23:17:32.705Z",
      "updatedAt":"2018-09-14T23:17:32.705Z"
    }
  ],
  "count":2
}
 * @apiUse MissingParamsError
 * @apiUse UnauthorizedError
 * @apiUse NotFound
 */

module.exports.getAllSchools = async (req, res) => {
  const { skip, city, isActive } = req.query;
  let { limit } = req.query;

  // Setting limit to max 100 values
  if (limit > 100) {
    limit = 100;
  }

  // Added query for filters
  const query = {};

  if (city) {
    query.city = city;
  }

  if (isActive) {
    query.isActive = isActive;
  }

  // Getting all schools and their count
  const [schools, count] = await Promise.all([
    School
      .find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean(),
    School.countDocuments(query),
  ]);

  if (!schools) {
    throw new Error(error.NOT_FOUND);
  }

  return res.status(200).send({
    message: 'Successfully got all schools',
    results: schools,
    count,
  });
};

/**
 * @api {get} /school/:schoolId Get School
 * @apiVersion 1.0.0
 * @apiName getSingleSchool
 * @apiDescription Get single school by id
 * @apiGroup School
 *
 * @apiParam (params) {String} schoolId Id of the School
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
  "message":"Successfully got school",
  "results":{
    "_id":"5b9cec86919bd041de435b54",
    "isActive":true,
    "name":"Ondricka and Sons",
    "address":"457 Stone Ways",
    "city":"Lake Scarlett",
    "contactNumber":"(643) 431-8280",
    "createdAt":"2018-09-15T11:27:02.204Z",
    "updatedAt":"2018-09-15T11:27:02.204Z",
    "__v":0
  }
}
 * @apiUse UnauthorizedError
 * @apiUse NotFound
 */
module.exports.getSingleSchool = async (req, res) => {
  const { schoolId } = req.params;

  // Finding school with given ID
  const school = await School
    .findOne({ _id: schoolId })
    .lean();

  // Throwing error if school is not found
  if (!school) {
    throw new Error(error.NOT_FOUND);
  }

  return res.status(200).send({
    message: 'Successfully got school',
    results: school,
  });
};

/**
 * @api {put} /school/:schoolId Edit school
 * @apiVersion 1.0.0
 * @apiName editSchool
 * @apiDescription Edit school with given id
 * @apiGroup School
 *
 * @apiParam (params) {String} schoolId Id of the School
 * @apiParam (body) {String} [name] School name
 * @apiParam (body) {String} [address] School address
 * @apiParam (body) {String} [city] School city
 * @apiParam (body) {String} [contactNumber] School contact
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
  "message":"Successfully edited school",
  "results":{
    "_id":"5b9cf37044b45b478213ea52",
    "isActive":true,
    "name":"McDermott Group",
    "address":"1773 Ryleigh Meadow",
    "city":"Coralieport",
    "contactNumber":"(408) 582-9649 x512",
    "createdAt":"2018-09-15T11:56:32.187Z",
    "updatedAt":"2018-09-15T11:56:32.674Z",
    "__v":0
  }
}
 * @apiUse UnauthorizedError
 * @apiUse NotFound
 * @apiUse MissingParamsError
 */

module.exports.editSchool = async (req, res) => {
  const { schoolId: _id } = req.params;
  const { name, contactNumber, city, address } = req.body;

  // Throwing error if none of the parameters were provided
  if (!name && !contactNumber && !city && !address) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  // Query for updating fields
  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }
  if (contactNumber) {
    updatedFields.contactNumber = contactNumber;
  }
  if (city) {
    updatedFields.city = city;
  }
  if (address) {
    updatedFields.address = address;
  }

  // Finding school with given ID
  let school = await School.findOne({ _id }).lean();

  // Throwing error if school is not found
  if (!school) {
    throw new Error(error.NOT_FOUND);
  }

  // Updating school with given query
  school = await School.findOneAndUpdate(
    { _id },
    { $set: updatedFields },
    { new: true },
  ).lean();

  return res.status(200).send({
    message: 'Successfully edited school',
    results: school,
  });
};
