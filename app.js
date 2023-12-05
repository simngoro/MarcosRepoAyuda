// app.js
import express from 'express';
import ProductManager from './main';

const app = express();
const port = 3000;

const productManager = new ProductManager('./main.json');

// Función asincrónica para cargar productos
const loadProductsAsync = async () => {
  try {
    await productManager.loadProducts();
  } catch (error) {
    console.error('Error al cargar productos:', error.message);
  }
};

// Ruta para consultar productos con soporte para el parámetro limit
app.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit);

  // Cargar productos de manera asincrónica
  await loadProductsAsync();

  let allProducts = productManager.getProducts();

  if (!isNaN(limit) && limit > 0) {
    // Si se proporciona un límite válido, limitar la cantidad de productos
    allProducts = allProducts.slice(0, limit);
  }

  res.json({ products: allProducts });
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
