const mongoose = require('mongoose');

const ShoppingCategorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    emoji: { type: String, default: '🛍️' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingCategory', ShoppingCategorySchema);
