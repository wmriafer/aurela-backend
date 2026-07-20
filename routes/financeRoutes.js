const FinanceEntry = require('../models/FinanceEntry');
const crudRoutes = require('./crudRouteFactory');

module.exports = crudRoutes(FinanceEntry, { allowedFields: ['desc', 'amount', 'type', 'date'] });
