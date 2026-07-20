const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI não definida no .env');
    process.exit(1);
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
