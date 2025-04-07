import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Priority = sequelize.define(
  'Priority',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '#FFFFFF',
    },
  },
  {
    tableName: 'prioridades',
    timestamps: false,
  },
);

export default Priority;
