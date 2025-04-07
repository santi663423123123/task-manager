import request from 'supertest';
import app from '../app.js';

describe('🧪 API /api/priorities', () => {
  let id;

  it('GET /api/priorities devuelve todas', async () => {
    const res = await request(app).get('/api/priorities');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/priorities crea una nueva', async () => {
    const res = await request(app)
      .post('/api/priorities')
      .send({ nombre: 'Alta prueba', color: '#aabbcc' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    id = res.body.id;
  });

  it('PUT /api/priorities/:id actualiza una', async () => {
    const res = await request(app)
      .put(`/api/priorities/${id}`)
      .send({ nombre: 'Modificada', color: '#ffeeaa' });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Modificada');
  });

  it('DELETE /api/priorities/:id elimina una', async () => {
    const res = await request(app).delete(`/api/priorities/${id}`);
    expect(res.statusCode).toBe(204);
  });
});
