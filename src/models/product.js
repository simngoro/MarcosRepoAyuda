import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product;