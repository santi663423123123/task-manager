import Task from './task.js';
import Subtask from './subtask.js';
import Priority from './priority.js';
import State from './state.js';

Priority.hasMany(Task, { foreignKey: 'prioridad_id' });
Task.belongsTo(Priority, { foreignKey: 'prioridad_id', as: 'priority' });

State.hasMany(Task, { foreignKey: 'estado_id' });
Task.belongsTo(State, { foreignKey: 'estado_id', as: 'state' });

Task.hasMany(Subtask, { foreignKey: 'tarea_padre_id', as: 'subtasks' });
Subtask.belongsTo(Task, { foreignKey: 'tarea_id', as: 'subtask' });

export {
  Task,
  Subtask,
  // TaskDetail,
  Priority,
  State,
};
