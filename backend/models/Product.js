const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, required: [true, 'Product name should not be blank'], unqiue: true },
  specification: { type: String, required: [true, 'Product specification should not be blank'] },
  description: { type: String, required: [true, 'Product description should not be blank'] },
  price: { type: Number, required: [true, 'Product price should be given'] },
  stock: { type: Number, required: [true, 'Please enter quantity for stock monioring'] },
  category: { type: String, required: [true, 'Specify the category the product belongs to'] },
  pictures: { type: Array, required: true }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;