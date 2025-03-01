const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProjectVersion extends Model {}

ProjectVersion.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'project_version',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false // No need for updatedAt on versions
});

module.exports = ProjectVersion; 