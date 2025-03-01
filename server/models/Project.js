const mongoose = require('mongoose');

// Project version schema - for storing history
const ProjectVersionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Register the ProjectVersion model
mongoose.model('ProjectVersion', ProjectVersionSchema);

// Main Project schema
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: Object,
    default: {}
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  publishedUrl: {
    type: String
  },
  lastPublished: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add method to create a project version/backup
ProjectSchema.methods.createVersion = async function() {
  const ProjectVersion = mongoose.model('ProjectVersion');
  
  // Store current state as a version
  await ProjectVersion.create({
    projectId: this._id,
    content: this.content,
    createdAt: new Date()
  });
  
  // Increment version number
  this.version += 1;
  return this.save();
};

// Method to get project with user check
ProjectSchema.statics.getProjectForUser = function(id, userId) {
  return this.findOne({ 
    _id: id,
    userId
  }).select('name content description createdAt updatedAt version isPublic publishedUrl lastPublished');
};

// Method to get public project
ProjectSchema.statics.getPublicProject = function(id) {
  return this.findOne({ 
    _id: id,
    isPublic: true
  }).select('name content description lastPublished');
};

module.exports = mongoose.model('Project', ProjectSchema);