const Task = require('../models/Task');
const HabitCategory = require('../models/HabitCategory');
const Habit = require('../models/Habit');
const ShoppingCategory = require('../models/ShoppingCategory');
const ShoppingItem = require('../models/ShoppingItem');
const Goal = require('../models/Goal');
const Study = require('../models/Study');
const FinanceEntry = require('../models/FinanceEntry');
const Note = require('../models/Note');
const Settings = require('../models/Settings');

const COLLECTIONS = {
  tasks: { Model: Task, fields: ['title', 'date', 'time', 'period', 'priority', 'done'] },
  habitCategories: { Model: HabitCategory, fields: ['name'] },
  habits: { Model: Habit, fields: ['name', 'categoryId', 'color', 'goal', 'frequency', 'history'] },
  shoppingCategories: { Model: ShoppingCategory, fields: ['name', 'emoji'] },
  shoppingItems: { Model: ShoppingItem, fields: ['name', 'price', 'qty', 'priority', 'notes', 'categoryId', 'bought', 'boughtDate'] },
  goals: { Model: Goal, fields: ['title', 'desc', 'type', 'done', 'subtasks'] },
  exams: { Model: Study, fields: ['subject', 'topic', 'date'] },
  finances: { Model: FinanceEntry, fields: ['desc', 'amount', 'type', 'date'] },
  notes: { Model: Note, fields: ['title', 'content', 'color'] },
};

function serialize(doc, fields) {
  const out = { id: doc._id.toString() };
  fields.forEach((f) => {
    out[f] = f === 'history' && doc.history instanceof Map ? Object.fromEntries(doc.history) : doc[f];
  });
  return out;
}

// GET /api/state — devolve tudo que o usuário logado precisa para montar a tela
async function getState(req, res, next) {
  try {
    const userId = req.userId;
    const [entries, settings] = await Promise.all([
      Promise.all(
        Object.entries(COLLECTIONS).map(async ([key, { Model, fields }]) => {
          const docs = await Model.find({ user: userId }).sort({ createdAt: 1 });
          return [key, docs.map((d) => serialize(d, fields))];
        })
      ),
      Settings.findOneAndUpdate({ user: userId }, {}, { upsert: true, new: true }),
    ]);

    const data = Object.fromEntries(entries);
    res.json({
      profile: { name: req.user.name, avatar: req.user.avatar },
     theme: settings.theme,
      accent: settings.accent,
      customBg: settings.customBg,
      ...data,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/state — sincroniza uma coleção inteira de uma vez (substitui os itens do usuário)
// Corpo esperado: { collection: 'tasks', items: [...] }
async function syncCollection(req, res, next) {
  try {
    const { collection, items } = req.body;
    const entry = COLLECTIONS[collection];
    if (!entry) return res.status(400).json({ message: 'Coleção inválida' });
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items deve ser uma lista' });

    const { Model, fields } = entry;
    const userId = req.userId;

    const existing = await Model.find({ user: userId }).select('_id');
    const existingIds = new Set(existing.map((d) => d._id.toString()));
    const incomingIds = new Set();

    // Processa cada item mantendo a MESMA ORDEM do array recebido do cliente,
    // para preservar ordenação manual (ex: arraste de tarefas).
    const resultItems = new Array(items.length);
    const ops = items.map((item, idx) => {
      const data = {};
      fields.forEach((f) => {
        if (item[f] !== undefined) data[f] = item[f];
      });

      if (item.id && existingIds.has(item.id)) {
        incomingIds.add(item.id);
        return Model.findOneAndUpdate({ _id: item.id, user: userId }, { $set: data }, { new: true }).then((doc) => {
          resultItems[idx] = serialize(doc, fields);
        });
      }
      return Model.create({ ...data, user: userId }).then((doc) => {
        resultItems[idx] = serialize(doc, fields);
      });
    });

    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length) ops.push(Model.deleteMany({ _id: { $in: toDelete }, user: userId }));

    await Promise.all(ops);

    res.json({ items: resultItems });
  } catch (err) {
    next(err);
  }
}

// PUT /api/state/settings — { theme, accent, profile: { name, avatar } }
async function syncSettings(req, res, next) {
  try {
  const { theme, accent, customBg, profile } = req.body;
    const data = {};
    if (theme !== undefined) data.theme = theme;
    if (accent !== undefined) data.accent = accent;
    if (customBg !== undefined) data.customBg = customBg;

    await Settings.findOneAndUpdate({ user: req.userId }, { $set: data }, { upsert: true });

    if (profile) {
      const User = require('../models/User');
      const user = await User.findById(req.userId);
      if (profile.name !== undefined) user.name = String(profile.name).trim().slice(0, 80) || user.name;
      if (profile.avatar !== undefined) user.avatar = profile.avatar;
      await user.save();
    }

    res.json({ message: 'Configurações salvas' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getState, syncCollection, syncSettings };
