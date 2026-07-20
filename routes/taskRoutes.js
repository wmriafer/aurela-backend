const Task = require('../models/Task');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(Task, {
  allowedFields: ['title', 'date', 'time', 'period', 'priority', 'done'],
});
