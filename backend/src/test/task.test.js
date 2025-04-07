import request from 'supertest';
import app from '../app.js';
import { Task, Priority, State } from '../models/index.js';

describe('🧪 API /api/tasks', () => {
  let taskId;
  let priorityId;
  let stateId;

  beforeAll(async () => {
    const priority = await Priority.create({ nombre: 'Alta', color: '#ff0000' });
    const state = await State.create({ nombre: 'Pendiente', color: '#00ff00' });
    priorityId = priority.id;
    stateId = state.id;
  });

  afterAll(async () => {
    await Task.destroy({ where: {} });
    await Priority.destroy({ where: {} });
    await State.destroy({ where: {} });
  });

  it('POST /api/tasks crea una nueva tarea', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Tarea de prueba',
      description: 'Una descripción',
      estimatedValue: 3,
      priority: priorityId,
      status: stateId,
      subtasks: [],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    taskId = res.body.id;
  });

  it('GET /api/tasks devuelve todas las tareas', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === taskId)).toBe(true);
  });

  it('PUT /api/tasks/:id actualiza la tarea', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({
      title: 'Tarea actualizada',
      description: 'Descripción actualizada',
      estimatedValue: 5,
      priority: priorityId,
      status: stateId,
      subtasks: [],
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Tarea actualizada');
  });

  it('DELETE /api/tasks/:id elimina la tarea', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminada correctamente/);
  });
});
