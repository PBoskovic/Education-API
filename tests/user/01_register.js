const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

describe('Register', () => {
  it('POST /register Should successfully register user (SuperAdmin)', (done) => {
    const body = {
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      age: faker.random.number({ max: 99 }),
      email: faker.internet.email().toLowerCase(),
      school: ObjectId(),
      phoneNumber: faker.phone.phoneNumber(),
      schoolClass: faker.commerce.department(),
      password: faker.internet.password(),
      role: 'SuperAdmin',
    };
    request(app)
      .post('/api/v1/register')
      .set('Accept', 'application/json')
      .send(body)
      .expect(200)
      .then(({ body: { message, results } }) => {
        message.should.equal('Successfully registered.');
        results.firstName.should.equal(body.firstName);
        results.lastName.should.equal(body.lastName);
        results.email.should.equal(body.email);
        results.role.should.equal(body.role);
        should.not.exist(results.password);
        done();
      })
      .catch(done);
  });

  it('POST /register Should return missing parameters', (done) => {
    const body = {
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };
    request(app)
      .post('/api/v1/register')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .then((res) => {
        res.body.message.should.equal('Missing parameters');
        res.body.errorCode.should.equal(2);
        done();
      })
      .catch(done);
  });
});
