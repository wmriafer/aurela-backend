const Study = require('../models/Study');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(Study, { allowedFields: ['subject', 'topic', 'date'] });
