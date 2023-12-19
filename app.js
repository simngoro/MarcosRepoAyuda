const express = require('express');
const exphbs = require('express-handlebars');
const expressWs = require('express-ws');
const fs = require('fs');
const { ProductManager, generateUniqueId } = require('./main');

const app = express();
expressWs(app);

const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('views', 'src/views');
app.set('views engine', 'handlebars')

app.use(express.json());

const productManager = new ProductManager('./productos.json');

app.get('/api/products', (req, res) => {
  const limit = parseInt(req.query.limit);
  const products = productManager.getProducts(limit);
  res.json({ products });
});

app.get('/api/products/:pid', (req, res) => {
  const product = productManager.getProductById(req.params.pid);
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', (req, res) => {
  const { title, description, code, price, stock, status, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || status === undefined || !category || !thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo thumbnails como un array no vacío.' });
  }
  const newProduct = {
    id: generateUniqueId(productManager.products),
    title,
    description,
    code,
    price,
    stock,
    status,
    category,
    thumbnails,
  };
  productManager.addProduct(newProduct);
  res.json({ product: newProduct });
});

app.put('/api/products/:pid', (req, res) => {
  const updatedProduct = productManager.updateProduct(req.params.pid, req.body);
  if (updatedProduct) {
    res.json({ product: updatedProduct });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const deletedProduct = productManager.deleteProduct(req.params.pid);
  if (deletedProduct) {
    res.json({ product: deletedProduct });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Configuración de WebSocket
app.ws('/api/ws', (ws, req) => {
  // conexión 
  ws.on('message', (msg) => {
    // mensajes 
    console.log(`Mensaje recibido: ${msg}`);
    ws.send('Mensaje recibido por el servidor');
  });
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
