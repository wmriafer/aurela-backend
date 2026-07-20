const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: String, required: true }, // formato ISO: YYYY-MM-DD
    time: { type: String, default: '' },
    period: { type: String, enum: ['manha', 'tarde', 'noite'], default: 'manha' },
    priority: { type: String, enum: ['baixa', 'media', 'alta'], default: 'media' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TaskSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Task', TaskSchema);
