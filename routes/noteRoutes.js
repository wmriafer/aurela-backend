const Note = require('../models/Note');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(Note, { allowedFields: ['title', 'content', 'color'] });
