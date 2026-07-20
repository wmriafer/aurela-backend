const mongoose = require('mongoose');

const ShoppingItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 1 },
    priority: { type: String, enum: ['baixa', 'media', 'alta'], default: 'media' },
    notes: { type: String, default: '' },
    categoryId: { type: String, default: '' },
    bought: { type: Boolean, default: false },
    boughtDate: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingItem', ShoppingItemSchema);
