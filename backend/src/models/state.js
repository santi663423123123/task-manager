import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const State = sequelize.define(
  'State',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(15),
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
    tableName: 'estados',
    timestamps: false,
  },
);

export default State;
