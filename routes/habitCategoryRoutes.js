const HabitCategory = require('../models/HabitCategory');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(HabitCategory, { allowedFields: ['name'] });
