const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Project extends Model {
  // Method to create a project version/backup
  async createVersion() {
    // Use the ProjectVersion model
    const ProjectVersion = require('./ProjectVersion');
    
    // Store current state as a version
    await ProjectVersion.create({
      projectId: this.id,
      content: this.content
    });
    
    // Increment version number
    this.version += 1;
    return this.save();
  }

  // Method to get public project - static method
  static async getPublicProject(id) {
    return await Project.findOne({ 
      where: {
        id: id,
        isPublic: true
      },
      attributes: ['name', 'content', 'description', 'lastPublished']
    });
  }
}

Project.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  content: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedUrl: {
    type: DataTypes.STRING
  },
  lastPublished: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'project',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Project;