const { User } = require('../../models');
const faker = require('faker');
const { issueNewToken } = require('../../lib/tokenHandler');

/**
 * @param {String} firstName User first name
 * @param {String} lastName User last name
 * @param {String} age User age
 * @param {String} email User email
 * @param {String} school User school ID
 * @param {String} schoolClass User class
 * @param {String} phoneNumber User phone number
 * @param {String} password User password
 * @returns {Promise} returns new User
 */

async function addUser(
  {
    firstName = faker.name.findName(),
    lastName = faker.name.lastName(),
    age = faker.random.number({ max: 99 }),
    email = faker.internet.email().toLowerCase(),
    school = faker.company.companyName(),
    schoolClass = faker.commerce.department(),
    phoneNumber = faker.phone.phoneNumber(),
    password = faker.internet.password(),
  } = {}) {
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

  return user;
}

/**
 * @param {Number} number Number of users needed
 * @returns {Promise} returns an array of users
 */

function addManyUsers(
  {
    number = faker.random.number({ min: 1, max: 10 }),
  } = {}) {
  // Generate User Data
  const data = [];
  for (let i = 0; i < number; i += 1) {
    data.push({
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      age: faker.random.number({ max: 99 }),
      email: faker.internet.email().toLowerCase(),
      school: faker.company.companyName(),
      schoolClass: faker.commerce.department(),
      phoneNumber: faker.phone.phoneNumber(),
      password: faker.internet.password(),
    });
  }

  // Insert users and get their Id-s and Emails
  return User.insertMany(data);
}

module.exports = {
  addUser,
  addManyUsers,
};
