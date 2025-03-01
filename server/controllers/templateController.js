// server/controllers/templateController.js
const path = require('path');
const fs = require('fs').promises;

/**
 * Get all available templates
 */
exports.getTemplates = async (req, res) => {
  try {
    // Read templates directory
    const templatesDir = path.join(__dirname, '../templates');
    const files = await fs.readdir(templatesDir);
    
    // Filter for JSON files
    const templateFiles = files.filter(file => file.endsWith('.json'));
    
    // Read templates metadata
    const templates = await Promise.all(templateFiles.map(async (file) => {
      const filePath = path.join(templatesDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const template = JSON.parse(content);
      
      return {
        id: path.basename(file, '.json'),
        name: template.name,
        description: template.description,
        category: template.category,
        thumbnail: template.thumbnail
      };
    }));
    
    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Failed to get templates' });
  }
};

/**
 * Get a specific template
 */
exports.getTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    
    // Validate template ID to prevent directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID' });
    }
    
    // Get template file path
    const templatePath = path.join(__dirname, '../templates', `${templateId}.json`);
    
    try {
      // Read template file
      const content = await fs.readFile(templatePath, 'utf8');
      const template = JSON.parse(content);
      
      res.json(template);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'Template not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: 'Failed to get template' });
  }
};

/**
 * Create a new template (Admin only)
 */
exports.createTemplate = async (req, res) => {
  try {
    // Check admin permissions
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin permission required' });
    }
    
    const { id, name, description, category, content } = req.body;
    
    // Validate required fields
    if (!id || !name || !content) {
      return res.status(400).json({ message: 'Template ID, name, and content are required' });
    }
    
    // Validate template ID format
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid template ID format' });
    }
    
    // Create template object
    const template = {
      name,
      description: description || '',
      category: category || 'general',
      thumbnail: `/assets/templates/${id}.jpg`,
      content,
      createdAt: new Date().toISOString()
    };
    
    // Get template file path
    const templatePath = path.join(__dirname, '../templates', `${id}.json`);
    
    // Check if template already exists
    try {
      await fs.access(templatePath);
      return res.status(409).json({ message: 'Template ID already exists' });
    } catch (error) {
      // File doesn't exist, continue
    }
    
    // Write template file
    await fs.writeFile(templatePath, JSON.stringify(template, null, 2), 'utf8');
    
    res.status(201).json({
      id,
      name,
      description: template.description,
      category: template.category,
      thumbnail: template.thumbnail
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Failed to create template' });
  }
};

/**
 * Update an existing template (Admin only)
 */
exports.updateTemplate = async (req, res) => {
  try {
    // Check admin permissions
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin permission required' });
    }
    
    const templateId = req.params.id;
    const { name, description, category, content } = req.body;
    
    // Validate template ID to prevent directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID' });
    }
    
    // Get template file path
    const templatePath = path.join(__dirname, '../templates', `${templateId}.json`);
    
    // Read existing template
    try {
      const existingContent = await fs.readFile(templatePath, 'utf8');
      const existingTemplate = JSON.parse(existingContent);
      
      // Update template
      const updatedTemplate = {
        ...existingTemplate,
        name: name || existingTemplate.name,
        description: description !== undefined ? description : existingTemplate.description,
        category: category || existingTemplate.category,
        content: content || existingTemplate.content,
        updatedAt: new Date().toISOString()
      };
      
      // Write updated template
      await fs.writeFile(templatePath, JSON.stringify(updatedTemplate, null, 2), 'utf8');
      
      res.json({
        id: templateId,
        name: updatedTemplate.name,
        description: updatedTemplate.description,
        category: updatedTemplate.category,
        thumbnail: updatedTemplate.thumbnail
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'Template not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Failed to update template' });
  }
};

/**
 * Delete a template (Admin only)
 */
exports.deleteTemplate = async (req, res) => {
  try {
    // Check admin permissions
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin permission required' });
    }
    
    const templateId = req.params.id;
    
    // Validate template ID to prevent directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID' });
    }
    
    // Get template file path
    const templatePath = path.join(__dirname, '../templates', `${templateId}.json`);
    
    try {
      // Check if template exists
      await fs.access(templatePath);
      
      // Delete template file
      await fs.unlink(templatePath);
      
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'Template not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Failed to delete template' });
  }
};