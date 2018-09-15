const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { addUser } = require('../helpers/userHelper');
const { User } = require('../../models');

describe('Signin', () => {
  it('POST /signin Should successfully sign in', (done) => {
    addUser({ password: '123' })
      .then(({ results: user }) => {
        const body = {
          email: user.email,
          password: '123',
        };
        return request(app)
          .post('/api/v1/signin')
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully signed in.');
            should.exist(results);
            return User.findOne({ email: results.email });
          })
          .then((dbUser) => {
            dbUser.email.should.equal(body.email);
            done();
          });
      })
      .catch(done);
  });

  it('POST /signin Should return missing parameters', (done) => {
    const body = {
      email: faker.internet.email(),
    };
    request(app)
      .post('/api/v1/signin')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .then(({ body: { message, errorCode } }) => {
        message.should.equal('Missing parameters');
        errorCode.should.equal(2);
        done();
      })
      .catch(done);
  });
});
