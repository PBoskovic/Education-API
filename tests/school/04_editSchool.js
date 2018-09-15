const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { School } = require('../../models');
const { addUser } = require('../helpers/userHelper');
const { addSchool } = require('../helpers/schoolHelper');
const faker = require('faker');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

describe('Edit school', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('PUT /school/:schoolId Should successfully edit school', (done) => {
    Promise.all([
      addUser(),
      addSchool(),
    ])
      .then(([{ token }, school]) => {
        const body = {
          name: faker.company.companyName(),
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          contactNumber: faker.phone.phoneNumber(),
        };
        return request(app)
          .put(`/api/v1/school/${school._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully edited school');
            return School.findOne({ name: results.name });
          })
          .then((dbSchool) => {
            dbSchool.name.should.equal(body.name);
            dbSchool.address.should.equal(body.address);
            dbSchool.city.should.equal(body.city);
            dbSchool.contactNumber.should.equal(body.contactNumber);
            done();
          });
      })
      .catch(done);
  });

  it('PUT /school/:schoolId Should return missing params error', (done) => {
    Promise.all([
      addUser(),
      addSchool(),
    ])
      .then(([{ token }, school]) => {
        const body = {};
        return request(app)
          .put(`/api/v1/school/${school._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(400)
          .then(({ body: { errorCode, message } }) => {
            errorCode.should.equal(2);
            message.should.equal('Missing parameters');
            done();
          });
      })
      .catch(done);
  });

  it('PUT /school/:schoolId Should return that the school is not found', (done) => {
    Promise.all([
      addUser(),
      addSchool(),
    ])
      .then(([{ token }]) => {
        const body = {
          name: faker.company.companyName(),
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          contactNumber: faker.phone.phoneNumber(),
        };
        return request(app)
          .put(`/api/v1/school/${ObjectId()}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(404)
          .then(({ body: { errorCode, message } }) => {
            errorCode.should.equal(4);
            message.should.equal('Not Found');
            done();
          });
      })
      .catch(done);
  });
});
