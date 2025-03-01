const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const isAuthenticated = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Project routes
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project version routes
router.get('/:id/versions', projectController.getProjectVersions);
router.get('/:id/versions/:versionId', projectController.getProjectVersion);

// Publishing routes
router.put('/:id/publish', projectController.publishProject);
router.put('/:id/unpublish', projectController.unpublishProject);

module.exports = router; 