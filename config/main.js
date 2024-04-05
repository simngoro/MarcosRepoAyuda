const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }

  addProduct(product) {
    product.id = generateUniqueId(this.products);
    this.products.push(product);
    this.saveProducts();
  }

  getProducts(limit) {
    let allProducts = this.products;
    if (!isNaN(limit) && limit > 0) {
      allProducts = allProducts.slice(0, limit);
    }
    return allProducts;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts();
      return this.products[productIndex];
    }
    return null;
  }

  deleteProduct(productId) {
    const deletedProduct = this.products.filter(product => product.id === productId)[0];
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts();
    return deletedProduct;
  }
}

function generateUniqueId(existingProducts) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000);
  } while (existingProducts.some(product => product.id === newId));
  return newId;
}

module.exports = { ProductManager, generateUniqueId };
