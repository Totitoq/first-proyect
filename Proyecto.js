const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
    }
  }

  readProductsFromFile() {
    const data = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(data);
  }

  writeProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }

  addProduct(product) {
    const products = this.readProductsFromFile();
    const newProduct = {
      id: products.length + 1,
      ...product,
    };
    products.push(newProduct);
    this.writeProductsToFile(products);
  }

  getProducts() {
    return this.readProductsFromFile();
  }

  getProductById(id) {
    const products = this.readProductsFromFile();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.readProductsFromFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    // Mantener el ID y actualizar otros campos
    products[index] = { ...products[index], ...updatedFields, id };
    this.writeProductsToFile(products);
  }

  deleteProduct(id) {
    const products = this.readProductsFromFile();
    const updatedProducts = products.filter((p) => p.id !== id);
    if (products.length === updatedProducts.length) {
      throw new Error('Producto no encontrado');
    }
    this.writeProductsToFile(updatedProducts);
  }
}

// Ejemplo de uso
const productManager = new ProductManager('productos.json');

console.log(productManager.getProducts()); // []

productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
});

console.log(productManager.getProducts()); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 } ]

console.log(productManager.getProductById(1)); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }

productManager.updateProduct(1, { price: 250 });

console.log(productManager.getProductById(1)); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 250, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }

productManager.deleteProduct(1);

try {
  console.log(productManager.getProductById(1)); // Debería arrojar un error
} catch (error) {
  console.error(error.message);
}
