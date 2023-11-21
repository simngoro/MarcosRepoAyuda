//IMPORTANTE, aca comienza el codigo para el curso de programacion Backend//

class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    // Método para agregar un nuevo producto al conjunto
    addProduct(product) {
      // Validar que todos los campos obligatorios estén presentes
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }
  
      // Validar que el campo "code" no se repita
      if (this.products.some(existingProduct => existingProduct.code === product.code)) {
        console.error("El código del producto ya existe");
        return;
      }
  
      // Agregar producto con ID autoincrementable
      const newProduct = {
        id: this.productIdCounter++,
        ...product,
      };
  
      this.products.push(newProduct);
      console.log("Producto agregado:", newProduct);
    }
  
    // Método para obtener todos los productos
    getProducts() {
      return this.products;
    }
  
    // Método para obtener un producto por ID
    getProductById(productId) {
      const product = this.products.find(p => p.id === productId);
  
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    }
  }
  
  // Ejemplo de uso
  const productManager = new ProductManager();
  
  // Agregar productos
  productManager.addProduct({
    title: "Clases de inglés",
    description: "Aprenda inglés con nuestros expertos profesores",
    price: 50,
    thumbnail: "path/to/ingles.jpg",
    code: "ENG101",
    stock: 20
  });
  
  productManager.addProduct({
    title: "Clases de español",
    description: "Aprenda español con nuestros profesionales",
    price: 45,
    thumbnail: "path/to/espanol.jpg",
    code: "ESP202",
    stock: 15
  });
  
  // Obtener todos los productos
  const allProducts = productManager.getProducts();
  console.log("Todos los productos:", allProducts);
  
  // Obtener producto por ID
  const productIdToFind = 2;
  const foundProduct = productManager.getProductById(productIdToFind);
  console.log("Producto encontrado:", foundProduct);