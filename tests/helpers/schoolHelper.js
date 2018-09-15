const { School } = require('../../models');
const faker = require('faker');

/**
 * @param {String} name School name
 * @param {String} address School address
 * @param {String} city School city
 * @param {String} contactNumber School contact
 * @returns {Promise} returns new School
 */

async function addSchool(
  {
    name = faker.company.companyName(),
    address = faker.address.streetAddress(),
    city = faker.address.city(),
    contactNumber = faker.phone.phoneNumber(),
  } = {}) {
  const school = await new School({
    name,
    address,
    city,
    contactNumber,
  }).save();

  return school;
}

/**
 * @param {Number} number Number of schools needed
 * @returns {Promise} returns an array of schools
 */

function addManySchools(
  {
    number = faker.random.number({ min: 1, max: 10 }),
    city = faker.address.city(),
  } = {}) {
  // Generate School Data
  const data = [];
  for (let i = 0; i < number; i += 1) {
    data.push({
      name: faker.company.companyName(),
      address: faker.address.streetAddress(),
      city,
      contactNumber: faker.phone.phoneNumber(),
    });
  }

  // Insert multiple schools
  return School.insertMany(data);
}

module.exports = {
  addSchool,
  addManySchools,
};
