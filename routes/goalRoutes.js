const Goal = require('../models/Goal');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(Goal, {
  allowedFields: ['title', 'desc', 'type', 'done', 'subtasks'],
});
