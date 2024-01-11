const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://marcosmolmedo:<Hannamontana.01>@cluster0.dqfidab.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;