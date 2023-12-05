const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }
  

  // Método privado para cargar productos desde el archivo
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // Si hay un error (por ejemplo, el archivo no existe), continuamos con un array vacío
      this.products = [];
    }
  }

  // Método privado para guardar productos en el archivo
  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }

  // Método para agregar un nuevo producto al conjunto
  addProduct(product) {
   if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
    console.error("Todos los campos son obligatorios");
     return;
    }

    // Asignar un ID autoincrementable
    const newProduct = {
      id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1,
      ...product,
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado:", newProduct);
  }

  // Método para obtener todos los productos
  getProducts() {
    this.loadProducts(); // Recargar productos desde el archivo antes de devolverlos
    return this.products;
  }

  // Método para obtener un producto por ID
  getProductById(productId) {
    this.loadProducts(); // Recargar productos desde el archivo antes de buscar
    const product = this.products.find(p => p.id === productId);

    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
      return null;
    }
  }

  // Método para actualizar un producto por ID
  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts();
      console.log("Producto actualizado:", this.products[productIndex]);
    } else {
      console.error("Producto no encontrado");
    }
  }

  // Método para eliminar un producto por ID
  deleteProduct(productId) {
    const productIndex = this.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProducts();
      console.log("Producto eliminado:", deletedProduct);
    } else {
      console.error("Producto no encontrado");
    }
  }
}

// Ejemplo de uso
const productManager = new ProductManager('./main.json');

// Obtener todos los productos
const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);
const newproduct = {description:"ultimo producto",thumbnail:"ruta",code:"clases",title:"nuevos productos",  price: 60, stock: 25 };
productManager.addProduct(newproduct)

// Actualizar producto por ID
const productIdToUpdate = 1;
const updatedFields = { price: 60, stock: 25 };
productManager.updateProduct(productIdToUpdate, updatedFields);

// Obtener todos los productos después de la actualización
const updatedProducts = productManager.getProducts();
console.log("Productos después de la actualización:", updatedProducts);

// Eliminar producto por ID
const productIdToDelete = 1;
productManager.deleteProduct(productIdToDelete);

// Obtener todos los productos después de la eliminación
const productsAfterDeletion = productManager.getProducts();
console.log("Productos después de la eliminación:", productsAfterDeletion);