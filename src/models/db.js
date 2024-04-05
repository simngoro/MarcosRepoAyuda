import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

const mongoose = require('mongoose');

const initializeDB = () => {
  mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => {
    console.log('Conexión a la base de datos establecida');
  }).catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });
};

module.exports = initializeDB;

// Conectar a la base de datos MongoDB
initializeDB();

// Producto con Mongoose
const ProductModel = mongoose.model('Product', {
  title: String,
  description: String,
  code: String,
  price: Number,
  stock: Number,
  status: Boolean,
  category: String,
  thumbnails: [String],
});

//  Carrito con Mongoose
const CartModel = mongoose.model('Cart', {
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});
const mongoose = require('mongoose');
