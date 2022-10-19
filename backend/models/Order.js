const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const orderSchema = new Schema({
  user_id: { type: String, required: true },
  order: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  isDelivered: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
