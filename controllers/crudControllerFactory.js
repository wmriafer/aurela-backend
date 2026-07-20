// Fábrica de controllers CRUD genéricos. Cada recurso (tarefas, hábitos, metas, etc.)
// usa esta fábrica para evitar duplicação de código, sempre isolando os dados por usuário.

function crudController(Model, { allowedFields }) {
  function pick(body) {
    const out = {};
    allowedFields.forEach((f) => {
      if (body[f] !== undefined) out[f] = body[f];
    });
    return out;
  }

  return {
    // GET /api/<recurso>
    async list(req, res, next) {
      try {
        const items = await Model.find({ user: req.userId }).sort({ createdAt: 1 });
        res.json(items);
      } catch (err) {
        next(err);
      }
    },

    // POST /api/<recurso>
    async create(req, res, next) {
      try {
        const data = pick(req.body);
        const item = await Model.create({ ...data, user: req.userId });
        res.status(201).json(item);
      } catch (err) {
        next(err);
      }
    },

    // PUT /api/<recurso>/:id
    async update(req, res, next) {
      try {
        const data = pick(req.body);
        const item = await Model.findOneAndUpdate(
          { _id: req.params.id, user: req.userId },
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ message: 'Item não encontrado' });
        res.json(item);
      } catch (err) {
        next(err);
      }
    },

    // DELETE /api/<recurso>/:id
    async remove(req, res, next) {
      try {
        const item = await Model.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!item) return res.status(404).json({ message: 'Item não encontrado' });
        res.json({ message: 'Removido com sucesso' });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = crudController;
