const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('Dog API tests', () => {
    let ownerToken, adopterToken, dogId;
    const password = 'test123';

    before(async () => {
        // Register owner
        let res = await chai.request(app)
            .post('/user/register')
            .send({ email: `owner${Date.now()}@example.com`, password });
        ownerToken = res.headers['set-cookie'][0];

        // Register adopter
        res = await chai.request(app)
            .post('/user/register')
            .send({ email: `adopter${Date.now()}@example.com`, password });
        adopterToken = res.headers['set-cookie'][0];
    });

    beforeEach(async () => {
        const res = await chai.request(app)
            .post('/dogs/register')
            .set('Cookie', ownerToken)
            .send({ name: `Dog${Date.now()}`, description: 'Test dog' });

        dogId = res.body.dog._id;
    });

    it('should fetch registered dogs', async () => {
        const res = await chai.request(app)
            .get('/dogs/registered')
            .set('Cookie', ownerToken);

        expect(res).to.have.status(200);
        expect(res.body.dogs).to.be.an('array');
        expect(res.body.total).to.be.greaterThan(0);
    });

    it('should fetch adopted dogs', async () => {
        const adoptRes = await chai.request(app)
            .post(`/dogs/adopt/${dogId}`)
            .set('Cookie', adopterToken)
            .send({ thankYouMsg: 'Thanks for adopting!' });

        expect(adoptRes).to.have.status(201);
        expect(adoptRes.body.dog.status).to.equal('ADOPTED');

        const res = await chai.request(app)
            .get('/dogs/adopted')
            .set('Cookie', adopterToken);

        expect(res).to.have.status(200);
        expect(res.body.dogs).to.be.an('array');
        expect(res.body.total).to.be.greaterThan(0);
        expect(res.body.dogs[0]._id).to.equal(dogId);
        expect(res.body.dogs[0].status).to.equal('ADOPTED');
    });

    it('should fail when no dog name is provided', async () => {
        const res = await chai.request(app)
            .post('/dogs/register')
            .set('Cookie', ownerToken)
            .send({ name: '', description: 'Test dog' });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('name');
        expect(res.body.errors.name).to.equal("Please enter dog's name.");   
    })

    it('should fail when user is unauthorized to register dog', async () => {
        const res = await chai.request(app)
            .post('/dogs/register')
            .send({ name: 'Doggo', description: 'Test dog' });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error', 'Authentication required');
    })

    it('should not allow owner to adopt their own dog', async () => {
        const res = await chai.request(app)
            .post(`/dogs/adopt/${dogId}`)
            .set('Cookie', ownerToken);

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'You cannot adopt your own dog.');
    });

    it('should allow adopter to adopt the dog', async () => {
        const res = await chai.request(app)
            .post(`/dogs/adopt/${dogId}`)
            .set('Cookie', adopterToken)
            .send({ thankYouMsg: 'Thanks!' });

        expect(res).to.have.status(201);
        expect(res.body.dog.status).to.equal('ADOPTED');
    });

    it('should not allow adopter to adopt already adopted dog', async () => {
        await chai.request(app)
            .post(`/dogs/adopt/${dogId}`)
            .set('Cookie', adopterToken);

        const res = await chai.request(app)
            .post(`/dogs/adopt/${dogId}`)
            .set('Cookie', adopterToken);

        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Dog already adopted');
    });

    it('should not allow adopter to remove a dog they do not own', async () => {
        const res = await chai.request(app)
            .post(`/dogs/remove/${dogId}`)
            .set('Cookie', adopterToken);

        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('Cannot delete other users dog.');
    });

    it('should remove a dog by the owner', async () => {
        const newDog = await chai.request(app)
            .post('/dogs/register')
            .set('Cookie', ownerToken)
            .send({ name: 'DeleteMe', description: 'Dog to delete' });

        const dogIdToDelete = newDog.body.dog._id;

        const res = await chai.request(app)
            .post(`/dogs/remove/${dogIdToDelete}`)
            .set('Cookie', ownerToken);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Dog removed successfully.');
    });
});