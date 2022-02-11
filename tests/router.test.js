const request = require('supertest');
const { app } = require('../app');

describe('GET non existing route', () => {
    it('should result in error', async () => {
        const response = await request(app).get('/countri');
        expect(response.status).toEqual(404);
    });
});


describe('GET /country', () => {
    it('should return all countries', async () => {
        const response = await request(app).get('/country');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return countries in region America', async () => {
        const response = await request(app).get('/country?region=America');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return countries in region Apac', async () => {
        const response = await request(app).get('/country?region=Apac');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return countries in region APAC', async () => {
        const response = await request(app).get('/country?region=APAC');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return countries in region Europe', async () => {
        const response = await request(app).get('/country?region=Europe');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return countries in region MEA', async () => {
        const response = await request(app).get('/country?region=MEA');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
    it('should return empty array', async () => {
        const response = await request(app).get('/country?region=europe');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response._body)).toBe(true);
    });
});
