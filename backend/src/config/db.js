const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI no está definida. La API funcionará sin persistencia.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.warn('La API seguirá funcionando, pero el registro de fincas/plantas/histórico no persistirá.');
  }
}

module.exports = connectDB;
