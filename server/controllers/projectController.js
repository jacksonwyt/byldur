const { Project, ProjectVersion } = require('../models');
const withTransaction = require('../utils/transactionWrapper');
const { Op } = require('sequelize');

// Get all projects for the current user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'name', 'description', 'isPublic', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    });
    
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new project
exports.createProject = withTransaction(async (req, res, transaction) => {
  try {
    const { name, description, content } = req.body;
    
    const project = await Project.create({
      name,
      description,
      content: content || {},
      userId: req.user.id
    }, { transaction });
    
    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
exports.updateProject = withTransaction(async (req, res, transaction) => {
  try {
    const { name, description, content } = req.body;
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      transaction
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // If content is being updated, create a version first
    if (content && JSON.stringify(project.content) !== JSON.stringify(content)) {
      await project.createVersion();
    }
    
    // Update fields if provided
    if (name) project.name = name;
    if (description) project.description = description;
    if (content) project.content = content;
    
    await project.save({ transaction });
    
    res.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
exports.deleteProject = withTransaction(async (req, res, transaction) => {
  try {
    const result = await Project.destroy({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      transaction
    });
    
    if (result === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project versions
exports.getProjectVersions = async (req, res) => {
  try {
    // First check if the project belongs to the user
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get versions
    const versions = await ProjectVersion.findAll({
      where: { projectId: req.params.id },
      attributes: ['id', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ versions });
  } catch (error) {
    console.error('Get project versions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific project version
exports.getProjectVersion = async (req, res) => {
  try {
    // First check if the project belongs to the user
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get the version
    const version = await ProjectVersion.findOne({
      where: { 
        id: req.params.versionId,
        projectId: req.params.id
      }
    });
    
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    res.json({ version });
  } catch (error) {
    console.error('Get project version error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Publish a project (make it public)
exports.publishProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.isPublic = true;
    project.lastPublished = new Date();
    
    // Generate a published URL if not already set
    if (!project.publishedUrl) {
      project.publishedUrl = `${process.env.FRONTEND_URL}/public/projects/${project.id}`;
    }
    
    await project.save();
    
    res.json({ project });
  } catch (error) {
    console.error('Publish project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unpublish a project (make it private)
exports.unpublishProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.isPublic = false;
    await project.save();
    
    res.json({ project });
  } catch (error) {
    console.error('Unpublish project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 