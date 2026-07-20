const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    categoryId: { type: String, default: '' },
    color: { type: String, default: '#D68CA4' },
    goal: { type: Number, default: 1 },
    frequency: { type: String, enum: ['diario', 'semanal'], default: 'diario' },
    history: { type: Map, of: Number, default: {} }, // { 'YYYY-MM-DD': contagem }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', HabitSchema);
