import express from 'express';

import { Task, Priority, State, Subtask } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

router.put('/:id', async (req, res) => {
  const { title, description, estimatedValue, priority, status, subtasks } = req.body;
  const taskId = req.params.id;

  try {
    const priorityRecord =
      typeof priority === 'string' ? await Priority.findOne({ where: { nombre: priority } }) : null;

    const stateRecord =
      typeof status === 'string' ? await State.findOne({ where: { nombre: status } }) : null;

    // Validaciones
    if (priority && !priorityRecord && typeof priority === 'string') {
      return res.status(400).json({ message: `Prioridad '${priority}' no encontrada.` });
    }

    if (status && !stateRecord && typeof status === 'string') {
      return res.status(400).json({ message: `Estado '${status}' no encontrado.` });
    }

    const priorityId = priorityRecord ? priorityRecord.id : priority;
    const stateId = stateRecord ? stateRecord.id : status;

    // Buscar tarea original
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (subtasks?.includes(Number(taskId))) {
      return res.status(400).json({ message: 'Una tarea no puede ser su propia subtarea.' });
    }

    const reverseRelations = await Subtask.findAll({
      where: {
        tarea_padre_id: subtasks,
        tarea_id: taskId,
      },
    });

    if (reverseRelations.length > 0) {
      return res
        .status(400)
        .json({
          message: 'Una subtarea no puede ser padre de la tarea actual (relación cíclica).',
        });
    }

    // ✅ Actualizar la tarea incluyendo fecha_actualizacion
    await task.update({
      titulo: title,
      descripcion: description,
      valor_estimado: estimatedValue,
      prioridad_id: priorityId,
      estado_id: stateId,
      fecha_actualizacion: new Date(),
    });

    // 🔄 Actualizar subtareas
    await Subtask.destroy({ where: { tarea_padre_id: taskId } });

    if (Array.isArray(subtasks) && subtasks.length > 0) {
      const subtaskRecords = subtasks.map((subtaskId) => ({
        tarea_padre_id: taskId,
        tarea_id: subtaskId,
      }));
      await Subtask.bulkCreate(subtaskRecords);
    }

    // 📦 Obtener tarea actualizada
    const updatedTask = await Task.findOne({
      where: { id: taskId },
      include: [
        { model: Priority, as: 'priority', attributes: ['id', 'nombre', 'color'] },
        { model: State, as: 'state', attributes: ['id', 'nombre', 'color'] },
        {
          model: Subtask,
          as: 'subtasks',
          include: [{ model: Task, as: 'subtask', attributes: ['id', 'titulo'] }],
        },
      ],
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
});





router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Eliminar relaciones de subtareas (si existen)
    await Subtask.destroy({
      where: {
        [Op.or]: [{ tarea_padre_id: taskId }, { tarea_id: taskId }],
      },
    });

    // Eliminar la tarea
    await task.destroy();

    res.json({ message: `Tarea #${taskId} eliminada correctamente.` });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
});





router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'nombre', 'color'],
          required: true,
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre', 'color'],
          required: true,
        },
        {
          model: Subtask,
          as: 'subtasks',
          include: [
            {
              model: Task,
              as: 'subtask',
              attributes: ['id', 'titulo'],
            },
          ],
        },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks with joins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.post('/', async (req, res) => {
  const { title, description, estimatedValue, priority, status, subtasks } = req.body;

  try {
    const newTask = await Task.create({
      titulo: title,
      descripcion: description,
      prioridad_id: priority,
      valor_estimado: estimatedValue,
      estado_id: status,
    });

    // Validar e insertar subtareas si hay
    if (Array.isArray(subtasks) && subtasks.length > 0) {
      // Evitar que se agregue a sí misma
      if (subtasks.includes(newTask.id)) {
        return res.status(400).json({ message: 'Una tarea no puede ser su propia subtarea.' });
      }

      // Evita que una subtarea ya sea padre de la tarea nueva (evita ciclos simples)
      const reverseRelations = await Subtask.findAll({
        where: {
          tarea_padre_id: subtasks,
          tarea_id: newTask.id,
        },
      });

      if (reverseRelations.length > 0) {
        return res
          .status(400)
          .json({
            message: 'Una subtarea no puede ser padre de la tarea actual (relación cíclica).',
          });
      }

      // ✅ Insertar relaciones válidas
      const subtaskRecords = subtasks.map((subtaskId) => ({
        tarea_padre_id: newTask.id,
        tarea_id: subtaskId,
      }));

      await Subtask.bulkCreate(subtaskRecords);
    }

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
});

export default router;
