// server/routes/templates.js
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplate);

// Admin routes (require authentication)
router.use(isAuthenticated);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;