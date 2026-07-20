const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    theme: { type: String, default: 'light' },       // light | dark
    accent: { type: String, default: 'rosa-bebe' },   // id do tema de cor escolhido
    customBg: { type: String, default: '' },          // cor de fundo personalizada (hex), opcional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
