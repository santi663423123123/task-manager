import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Priority from './priority.js';
import State from './state.js';

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    valor_estimado: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.allowNull,
      allowNull: true,
    },
  },
  {
    tableName: 'tareas',
    timestamps: false, // mantenemos false porque usamos campo personalizado
  },
);

Task.belongsTo(Priority, {
  foreignKey: {
    name: 'prioridad_id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
});

Task.belongsTo(State, {
  foreignKey: {
    name: 'estado_id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
});

export default Task;
