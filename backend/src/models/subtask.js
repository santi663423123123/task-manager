import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Task from './task.js';

const Subtask = sequelize.define(
  'Subtask',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'subtareas',
    timestamps: false,
  },
);

Subtask.belongsTo(Task, {
  foreignKey: {
    name: 'tarea_padre_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Subtask.belongsTo(Task, {
  foreignKey: {
    name: 'tarea_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

export default Subtask;
