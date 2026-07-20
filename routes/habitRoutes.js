const Habit = require('../models/Habit');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(Habit, {
  allowedFields: ['name', 'categoryId', 'color', 'goal', 'frequency', 'history'],
});
