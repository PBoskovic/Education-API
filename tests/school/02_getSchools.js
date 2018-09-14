const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { School } = require('../../models');
const { addUser } = require('../helpers/userHelper');
const { addManySchools } = require('../helpers/schoolHelper');
const mongoose = require('mongoose');

describe('Get all schools', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('GET /school Should successfully get all schools', (done) => {
    Promise.all([
      addUser(),
      addManySchools({ number: 5 }),
    ])
      .then(([{ token }]) => {
        return request(app)
          .get('/api/v1/school')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully got all schools');
            results.length.should.equal(5);
            done();
          });
      })
      .catch(done);
  });

});
