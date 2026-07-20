const express = require('express');
const { requireAuth } = require('../middleware/auth');
const crudController = require('../controllers/crudControllerFactory');

// Cria um roteador REST completo (GET, POST, PUT, DELETE) para um Model,
// sempre protegido por autenticação e isolado por usuário.
function crudRoutes(Model, options) {
  const router = express.Router();
  const ctrl = crudController(Model, options);

  router.use(requireAuth);
  router.get('/', ctrl.list);
  router.post('/', ctrl.create);
  router.put('/:id', ctrl.update);
  router.delete('/:id', ctrl.remove);

  return router;
}

module.exports = crudRoutes;
