const request = require('supertest');
const app = require('../app');

describe('GET /companies', () => {
  it('should return a list of companies', async () => {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toEqual(200);
    expect(res.body.companies).toBeDefined();
  });
});

describe('GET /companies/:code', () => {
  it('should return a company by code', async () => {
    const res = await request(app).get('/companies/TEST');
    expect(res.statusCode).toEqual(200);
    expect(res.body.company).toBeDefined();
    expect(res.body.company.code).toEqual('TEST');
  });

  it('should return 404 if company code does not exist', async () => {
    const res = await request(app).get('/companies/INVALID');
    expect(res.statusCode).toEqual(404);
  });
});
