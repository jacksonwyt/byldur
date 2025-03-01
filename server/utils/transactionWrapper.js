const sequelize = require('../config/database');

/**
 * Wraps a function in a database transaction
 * @param {Function} fn - Function that takes transaction as a parameter
 * @returns {Function} - Function that executes within a transaction
 */
module.exports = function withTransaction(fn) {
  return async function(...args) {
    const transaction = await sequelize.transaction();
    
    try {
      const result = await fn(...args, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}; 