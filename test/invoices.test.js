const request = require('supertest');
const app = require('../app');

describe('GET /invoices', () => {
  it('should return a list of invoices', async () => {
    const res = await request(app).get('/invoices');
    expect(res.statusCode).toEqual(200);
    expect(res.body.invoices).toBeDefined();
  });
});

describe('GET /invoices/:id', () => {
  it('should return an invoice by id', async () => {
    const res = await request(app).get('/invoices/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.invoice).toBeDefined();
    expect(res.body.invoice.id).toEqual(1);
  });

  it('should return 404 if invoice id does not exist', async () => {
    const res = await request(app).get('/invoices/9999');
    expect(res.statusCode).toEqual(404);
  });
});

