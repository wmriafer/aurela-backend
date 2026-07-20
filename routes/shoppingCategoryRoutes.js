const ShoppingCategory = require('../models/ShoppingCategory');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(ShoppingCategory, { allowedFields: ['name', 'emoji'] });
