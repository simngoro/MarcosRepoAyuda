import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;