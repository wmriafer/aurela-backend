const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    desc: { type: String, default: '', maxlength: 500 },
    type: { type: String, enum: ['anual', 'mensal', 'semanal'], default: 'anual' },
    done: { type: Boolean, default: false },
    subtasks: { type: [{ id: String, text: String, done: Boolean }], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
