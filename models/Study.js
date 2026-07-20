const mongoose = require('mongoose');

const StudySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    topic: { type: String, default: '', maxlength: 300 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Study', StudySchema);
