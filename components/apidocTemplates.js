/**
 * @apiDefine MissingParamsError
 *
 * @apiError (400) MissingParamsError Error Code <code>2</code> Missing parameters
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing parameters",
 *       "status": 400,
 *       "errorCode": 2,
 *     }
 */

/**
 * @apiDefine NotAcceptable
 *
 * @apiError (406) NotAcceptable Error Code <code>3</code> Not acceptable
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 406 Not Acceptable
 *     {
 *       "message": "Not acceptable",
 *       "status": 406,
 *       "errorCode": 3,
 *     }
 */

/**
 * @apiDefine NotFound
 *
 * @apiError (404) NotFound Error Code <code>4</code> Not Found
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Not Found",
 *       "status": 404,
 *       "errorCode": 4,
 *     }
 */

/**
 * @apiDefine Forbidden
 *
 * @apiError (403) Forbidden Error Code <code>5</code> Insufficient privileges
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "Insufficient privileges",
 *       "status": 403,
 *       "errorCode": 5,
 *     }
 */

/**
 * @apiDefine CredentialsError
 *
 * @apiError (401) CredentialsError Error Code <code>8</code> Wrong credentials
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Wrong credentials",
 *       "status": 401,
 *       "errorCode": 6,
 *     }
 */

/**
 * @apiDefine UnauthorizedError
 *
 * @apiError (401) UnauthorizedError Error Code <code>12</code> Invalid credentials
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid credentials",
 *       "status": 401,
 *       "errorCode": 7,
 *     }
 */
