const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { addUser } = require('../helpers/userHelper');
const { addSchool } = require('../helpers/schoolHelper');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

describe('Get single school', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('GET /school/:schoolId Should successfully get single school', (done) => {
    Promise.all([
      addUser(),
      addSchool(),
    ])
      .then(([{ token }, school]) => {
        return request(app)
          .get(`/api/v1/school/${school._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully got school');
            results.name.should.equal(school.name);
            done();
          });
      })
      .catch(done);
  });

  it('GET /school/:schoolId Should return that the school was not found', (done) => {
    Promise.all([
      addUser(),
      addSchool(),
    ])
      .then(([{ token }]) => {
        return request(app)
          .get(`/api/v1/school/${ObjectId()}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
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
