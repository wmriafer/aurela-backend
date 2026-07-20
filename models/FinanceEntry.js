const mongoose = require('mongoose');

const FinanceEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    desc: { type: String, required: true, trim: true, maxlength: 150 },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['entrada', 'saida'], required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FinanceEntry', FinanceEntrySchema);
