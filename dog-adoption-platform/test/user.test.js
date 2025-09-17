const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('User API tests', () => {
    const password = 'test123';
    let testEmail;

    // Clear DB before tests
    before(async () => {
        await mongoose.connection.collections.users.deleteMany({});
    });

    beforeEach(() => {
        testEmail = `test${Date.now()}@example.com`;
    });

    it('should register a new user', async () => {
        const res = await chai.request(app)
            .post('/user/register')
            .send({ email: testEmail, password });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
    });

    it('should login with an existing user', async () => {
        await chai.request(app)
            .post('/user/register')
            .send({ email: testEmail, password });

        const res = await chai.request(app)
            .post('/user/login')
            .send({ email: testEmail, password });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.be.a('string');
        expect(res).to.have.cookie('jwt');
    });

    it('login should fail with wrong credentials', async () => {
        await chai.request(app)
            .post('/user/register')
            .send({ email: testEmail, password });

        const res = await chai.request(app)
            .post('/user/login')
            .send({ email: testEmail, password: 'test1234' });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('password');
        expect(res.body.errors.password).to.equal('that password is incorrect');
        expect(res).to.not.have.cookie('jwt');
    });
});