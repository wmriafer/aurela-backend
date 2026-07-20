const mongoose = require('mongoose');

const HabitCategorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HabitCategory', HabitCategorySchema);
