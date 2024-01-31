const express = require('express');
const exphbs = require('express-handlebars');
const expressWs = require('express-ws');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { User } = require('./models/user');
const { ProductManager, CartManager } = require('./main');
const { initializeDB } = require('./models/db.js');

const app = express();
expressWs(app);

const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto',
  resave: true,
  saveUninitialized: true,
}));

// Middleware para verificar la sesión
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// Rutas para sesiones
const sessionsRouter = require('./routes/sessions');
app.use('/api/sessions', sessionsRouter);

// Rutas para vistas
const viewsRouter = require('./routes/views');
app.use('/', viewsRouter);

// Conectar a la base de datos MongoDB
initializeDB();

// Modelo de Producto con Mongoose
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

// Modelo de Carrito con Mongoose
const CartModel = mongoose.model('Cart', {
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

// Rutas para Productos
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = 'asc' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (query) {
      filter = { $text: { $search: query } };
    }

    const products = await ProductModel
      .find(filter)
      .sort({ price: sort === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&query=${query}&sort=${sort}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&query=${query}&sort=${sort}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      currentPage: page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (product) {
      res.json({ status: 'success', payload: product });
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, description, code, price, stock, status, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || status === undefined || !category || !thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0) {
      return res.status(400).json({ status: 'error', error: 'Todos los campos son obligatorios, incluyendo thumbnails como un array no vacío.' });
    }

    const newProduct = await ProductModel.create({
      title,
      description,
      code,
      price,
      stock,
      status,
      category,
      thumbnails,
    });

    res.json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );

    if (updatedProduct) {
      res.json({ status: 'success', payload: updatedProduct });
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);

    if (deletedProduct) {
      res.json({ status: 'success', payload: deletedProduct });
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

// Rutas para Carritos
app.get('/api/carts', async (req, res) => {
  try {
    const carts = await CartModel.find().populate('products');
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products');
    if (cart) {
      res.json({ status: 'success', payload: cart });
    } else {
      res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.post('/api/carts', async (req, res) => {
  try {
    const newCart = await CartModel.create({});
    res.json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.put('/api/carts/:cid', async (req, res) => {
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      req.body,
      { new: true }
    ).populate('products');

    if (updatedCart) {
      res.json({ status: 'success', payload: updatedCart });
    } else {
      res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.put('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ status: 'error', error: 'La cantidad debe ser un número positivo' });
    }

    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    const existingProductIndex = cart.products.findIndex(p => p._id.toString() === req.params.pid);
    if (existingProductIndex !== -1) {
      // aca se actualiza la cantidad
      cart.products[existingProductIndex].quantity = quantity;
    } else {
      cart.products.push({
        _id: product._id,
        quantity,
      });
    }

    const updatedCart = await cart.save().populate('products');
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

app.delete('/api/carts/:cid', async (req, res) => {
  try {
    const deletedCart = await CartModel.findByIdAndDelete(req.params.cid);

    if (deletedCart) {
      res.json({ status: 'success', payload: deletedCart });
    } else {
      res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

// Configuración de WebSocket
app.ws('/api/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(`Mensaje recibido: ${msg}`);
    ws.send('Mensaje recibido por el servidor');
  });
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
