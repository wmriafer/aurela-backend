const ShoppingItem = require('../models/ShoppingItem');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(ShoppingItem, {
  allowedFields: ['name', 'price', 'qty', 'priority', 'notes', 'categoryId', 'bought', 'boughtDate'],
});
