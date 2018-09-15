const { User } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {get} /user Get all users for SuperAdmin
 * @apiVersion 1.0.1
 * @apiName getAllUsersForSuperAdmin
 * @apiDescription Get all users for SuperAdmin
 * @apiGroup User
 *
 * @apiParam (query) {String} [skip] Number of users to skip
 * @apiParam (query) {String} [limit] Number of users to limit
 * @apiParam (query) {String} [school] Id of the user's school
 * @apiParam (query) {Boolean} [isActive] Filter by user status
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message":"Successfully got all users",
   "results":[
      {
         "_id":"5b9d0688d8af43632a0840e3",
         "isActive":true,
         "firstName":"Luna O'Hara",
         "lastName":"Goyette",
         "age":"79",
         "email":"austin96@hotmail.com",
         "school":"5b9d0688d8af43632a0840dd",
         "schoolClass":"Movies",
         "phoneNumber":"267.245.7932",
         "role":"Admin",
         "__v":0,
         "createdAt":"2018-09-15T13:18:00.472Z",
         "updatedAt":"2018-09-15T13:18:00.472Z"
      },
      {
         "_id":"5b9d0688d8af43632a0840e4",
         "isActive":true,
         "firstName":"Gonzalo Hayes",
         "lastName":"Upton",
         "age":"18",
         "email":"norwood_huels1@yahoo.com",
         "school":"5b9d0688d8af43632a0840dd",
         "schoolClass":"Outdoors",
         "phoneNumber":"1-503-403-0436 x051",
         "role":"Admin",
         "__v":0,
         "createdAt":"2018-09-15T13:18:00.472Z",
         "updatedAt":"2018-09-15T13:18:00.472Z"
      }
   ],
   "count":2
}
 * @apiUse MissingParamsError
 * @apiUse UnauthorizedError
 * @apiUse NotFound
 */

module.exports.getAllUsersForSuperAdmin = async (req, res) => {
  const { skip, school, isActive } = req.query;
  let { limit } = req.query;

  // Setting limit to max 100 values
  if (limit > 100) {
    limit = 100;
  }

  // Adding query for filters (Super admin can only get Admins and SuperAdmins and not himself)
  const query = {
    _id: { $ne: req.user._id },
    role: { $in: ['SuperAdmin', 'Admin'] },
  };

  // Making query for multiple filters
  const and = [];

  if (school) {
    and.push({ school });
  }

  if (isActive) {
    and.push({ isActive });
  }

  if (and.length) {
    query.$and = and;
  }

  // Getting all users and their count
  const [users, count] = await Promise.all([
    User
      .find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean(),
    User.countDocuments(query),
  ]);

  if (!users) {
    throw new Error(error.NOT_FOUND);
  }

  return res.status(200).send({
    message: 'Successfully got all users',
    results: users,
    count,
  });
};

/**
 * @api {get} /school/:schoolId/user Get all users
 * @apiVersion 1.0.1
 * @apiName getAllUsers
 * @apiDescription Get all users for Admin
 * @apiGroup User
 *
 * @apiParam (query) {String} [skip] Number of users to skip
 * @apiParam (query) {String} [limit] Number of users to limit
 * @apiParam (query) {Boolean} [isActive] Filter by user status
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
   "message":"Successfully got all users",
   "results":[
      {
         "_id":"5b9d1097a77b986cf4b5c2d8",
         "isActive":true,
         "firstName":"Ms. Ford Jakubowski",
         "lastName":"Romaguera",
         "age":"50",
         "email":"erna.vandervort82@hotmail.com",
         "school":"5b9d1097a77b986cf4b5c2d5",
         "schoolClass":"Books",
         "phoneNumber":"042-636-7511",
         "role":"Student",
         "__v":0,
         "createdAt":"2018-09-15T14:00:55.946Z",
         "updatedAt":"2018-09-15T14:00:55.947Z"
      },
      {
         "_id":"5b9d1097a77b986cf4b5c2d9",
         "isActive":true,
         "firstName":"Ms. Susie Gorczany",
         "lastName":"Feeney",
         "age":"0",
         "email":"annetta.goodwin@yahoo.com",
         "school":"5b9d1097a77b986cf4b5c2d5",
         "schoolClass":"Electronics",
         "phoneNumber":"133-249-4731 x2598",
         "role":"Student",
         "__v":0,
         "createdAt":"2018-09-15T14:00:55.947Z",
         "updatedAt":"2018-09-15T14:00:55.947Z"
      }
   ],
   "count":2
}
 * @apiUse MissingParamsError
 * @apiUse UnauthorizedError
 * @apiUse NotFound
 */

module.exports.getAllUsers = async (req, res) => {
  const { schoolId } = req.params;
  const { skip, isActive } = req.query;
  let { limit } = req.query;

  // Setting limit to max 100 values
  if (limit > 100) {
    limit = 100;
  }

  // Adding query for filters (Admin can see admins and students of the same school)
  const query = {
    _id: { $ne: req.user._id },
    school: schoolId,
    role: { $in: ['Student', 'Admin'] },
  };

  // Making query for multiple filters
  const and = [];

  if (isActive) {
    and.push({ isActive });
  }

  if (and.length) {
    query.$and = and;
  }

  // Getting all users and their count
  const [users, count] = await Promise.all([
    User
      .find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean(),
    User.countDocuments(query),
  ]);

  if (!users) {
    throw new Error(error.NOT_FOUND);
  }

  return res.status(200).send({
    message: 'Successfully got all users',
    results: users,
    count,
  });
};
