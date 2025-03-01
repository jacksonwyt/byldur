const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, content } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    const newProject = new Project({
      name,
      description: description || '',
      content: content || {},
      userId: req.user._id
    });
    
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, content } = req.body;
    
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Create a version/backup before updating
    await project.createVersion();
    
    // Update the project
    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.content = content || project.content;
    
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a duplicate of a project
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const sourceProject = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!sourceProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Create a new project with the same content
    const duplicatedProject = new Project({
      name: `${sourceProject.name} (Copy)`,
      description: sourceProject.description,
      content: sourceProject.content,
      userId: req.user._id
    });
    
    const savedProject = await duplicatedProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error duplicating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get project versions/history
router.get('/:id/versions', auth, async (req, res) => {
  try {
    // Check if user owns the project
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Get versions
    const ProjectVersion = mongoose.model('ProjectVersion');
    const versions = await ProjectVersion.find({
      projectId: req.params.id
    }).sort({ createdAt: -1 });
    
    res.json(versions);
  } catch (error) {
    console.error('Error fetching project versions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Restore a specific version
router.post('/:id/restore/:versionId', auth, async (req, res) => {
  try {
    // Check if user owns the project
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Find the version
    const ProjectVersion = mongoose.model('ProjectVersion');
    const version = await ProjectVersion.findOne({
      _id: req.params.versionId,
      projectId: req.params.id
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // Create a backup of current state before restoring
    await project.createVersion();
    
    // Restore the content from the version
    project.content = version.content;
    await project.save();
    
    res.json({ 
      message: 'Version restored successfully',
      project
    });
  } catch (error) {
    console.error('Error restoring project version:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 