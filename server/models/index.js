const User = require('./User');
const Project = require('./Project');
const ProjectVersion = require('./ProjectVersion');
const Subscription = require('./Subscription');
const AIUsage = require('./AIUsage');
const AICredit = require('./AICredit');
const PaymentHistory = require('./PaymentHistory');

// Define relationships
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(ProjectVersion, { foreignKey: 'projectId', onDelete: 'CASCADE' });
ProjectVersion.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(AIUsage, { foreignKey: 'userId', onDelete: 'CASCADE' });
AIUsage.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AICredit, { foreignKey: 'userId', onDelete: 'CASCADE' });
AICredit.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PaymentHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
PaymentHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Project,
  ProjectVersion,
  Subscription,
  AIUsage,
  AICredit,
  PaymentHistory
}; 