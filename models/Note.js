const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', trim: true, maxlength: 150 },
    content: { type: String, default: '', maxlength: 5000 },
    color: { type: String, default: '#F7E7EC' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);
