const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { addUser, addManyUsers } = require('../helpers/userHelper');
const { addSchool } = require('../helpers/schoolHelper');
const mongoose = require('mongoose');

describe('Get all users', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('GET /user Should successfully get all users (for SuperAdmin)', (done) => {
    Promise.all([
      addUser(),
      addManyUsers({ number: 5, role: 'Student' }),
      addManyUsers({ number: 3, role: 'Admin' }),
    ])
      .then(([{ token }]) => {
        return request(app)
          .get('/api/v1/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully got all users');
            results.length.should.equal(3);
            const checkIfValidRoles = results.every(user => user.role === 'SuperAdmin' || user.role === 'Admin');
            checkIfValidRoles.should.equal(true);
            done();
          });
      })
      .catch(done);
  });

  it('GET /user Should successfully get all users (filtered by school)', (done) => {
    addSchool()
      .then((school) => {
        return Promise.all([
          addUser(),
          addManyUsers({ number: 5, role: 'Admin', school: school._id }),
          addManyUsers({ number: 3, role: 'Student', school: school._id }),
          addManyUsers({ number: 2, role: 'Admin' }),
        ])
          .then(([{ token }]) => {
            return request(app)
              .get(`/api/v1/user?school=${school._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .then(({ body: { results, message } }) => {
                message.should.equal('Successfully got all users');
                results.length.should.equal(5);
                const checkIfValidRoles = results.every(user => user.role === 'SuperAdmin' || user.role === 'Admin');
                checkIfValidRoles.should.equal(true);
                const sameSchool = results.every(result => result.school === school._id.toString());
                sameSchool.should.equal(true);
                done();
              });
          });
      })
      .catch(done);
  });

  it('GET /school/:schoolId/user Should successfully get all users (for Admin)', (done) => {
    addSchool()
      .then((school) => {
        return Promise.all([
          addUser({ role: 'Admin', school: school._id }),
          addManyUsers({ number: 3, role: 'Student', school: school._id }),
          addManyUsers({ number: 2, role: 'Admin' }),
        ])
          .then(([{ token }]) => {
            return request(app)
              .get(`/api/v1/school/${school._id}/user`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .then(({ body: { results, message } }) => {
                message.should.equal('Successfully got all users');
                results.length.should.equal(3);
                const checkIfValidRoles = results.every(user => user.role === 'Student' || user.role === 'Admin');
                checkIfValidRoles.should.equal(true);
                const sameSchool = results.every(result => result.school === school._id.toString());
                sameSchool.should.equal(true);
                done();
              });
          });
      })
      .catch(done);
  });
});
