const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { School } = require('../../models');
const { addUser } = require('../helpers/userHelper');

describe('Add new school', () => {
  it('POST /school Should successfully add new school', (done) => {
    addUser()
      .then(({ token }) => {
        const body = {
          name: faker.company.companyName(),
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          contactNumber: faker.phone.phoneNumber(),
        };
        return request(app)
          .post('/api/v1/school')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(200)
          .then(({ body: { results, message } }) => {
            message.should.equal('Successfully added new school');
            results.name.should.equal(body.name);
            results.address.should.equal(body.address);
            results.city.should.equal(body.city);
            results.contactNumber.should.equal(body.contactNumber);
            return School.findOne({ name: body.name });
          }).then((dbSchool) => {
            should.exist(dbSchool);
            dbSchool.name.should.equal(body.name);
            dbSchool.address.should.equal(body.address);
            dbSchool.city.should.equal(body.city);
            dbSchool.contactNumber.should.equal(body.contactNumber);
            done();
          });
      })
      .catch(done);
  });

  it('POST /school Should return missing parameters', (done) => {
    addUser()
      .then(({ token }) => {
        const body = {
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          contactNumber: faker.phone.phoneNumber(),
        };
        return request(app)
          .post('/api/v1/school')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(400)
          .then(({ body: { message, errorCode } }) => {
            message.should.equal('Missing parameters');
            errorCode.should.equal(2);
            done();
          });
      })
      .catch(done);
  });
});
