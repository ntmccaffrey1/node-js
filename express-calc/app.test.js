const request = require('supertest');
const app = require('./app');

describe('GET /mean (with middleware)', () => {
    test('GET /mean returns correct mean', async () => {
        const res = await request(app).get('/mean').query({ nums: '1,3,5,7' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({response: { operation: 'mean', value: 4 }});
    });    
  
    test('should return 400 if nums is missing', async () => {
        const res = await request(app).get('/mean');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Numbers are required.' });
    });

    test('should return 400 if nums contains non-numeric values', async () => {
        const res = await request(app).get('/mean').query({ nums: '1,foo,3' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid number.' });
    });

    test('should return 400 if nums is empty', async () => {
        const res = await request(app).get('/mean').query({ nums: '' });
        expect(res.status).toBe(400);
    });
});

describe('GET /median (with middleware)', () => {
    test('GET /median returns correct median', async () => {
        const res = await request(app).get('/median').query({ nums: '1,3,5,7' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({response: { operation: 'median', value: 4 }});
    });    
  
    test('should return 400 if nums is missing', async () => {
        const res = await request(app).get('/median');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Numbers are required.' });
    });

    test('should return 400 if nums contains non-numeric values', async () => {
        const res = await request(app).get('/median').query({ nums: '1,foo,3' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid number.' });
    });

    test('should return 400 if nums is empty', async () => {
        const res = await request(app).get('/median').query({ nums: '' });
        expect(res.status).toBe(400);
    });
});

describe('GET /mode (with middleware)', () => {
    test('GET /mode returns correct mode', async () => {
        const res = await request(app).get('/mode').query({ nums: '1,3,3,5,7,7,7,9' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({response: { operation: 'mode', value: 7 }});
    });    
  
    test('should return 400 if nums is missing', async () => {
        const res = await request(app).get('/mode');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Numbers are required.' });
    });

    test('should return 400 if nums contains non-numeric values', async () => {
        const res = await request(app).get('/mode').query({ nums: '1,foo,3' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid number.' });
    });

    test('should return 400 if nums is empty', async () => {
        const res = await request(app).get('/mode').query({ nums: '' });
        expect(res.status).toBe(400);
    });
});