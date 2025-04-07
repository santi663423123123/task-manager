import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Task from './task.js';

const TaskDetail = sequelize.define(
  'TaskDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 4000],
      },
    },
    actualizado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'detalle_tarea',
    timestamps: false,
  },
);

TaskDetail.belongsTo(Task, {
  foreignKey: {
    name: 'tarea_id',
    allowNull: false,
    unique: true,
  },
  onDelete: 'CASCADE',
});

export default TaskDetail;
