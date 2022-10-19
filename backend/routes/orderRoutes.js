const Order = require('../models/Order');
const router = require('express').Router();
const User = require('../models/User')
const Product = require('../models/Product')

router.get('/undelivered-orders', async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.json(allOrders);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.post('/create-order', async (req, res) => {

  try {
    const newOrder = await Order.create(req.body);
    const foundUser = await User.findById(req.body.user_id);
    foundUser.cart.map(async (item) => {
      await Product.findByIdAndUpdate(item.product._id, { stock: item.product.stock * 1 - item.quantity * 1 })
    })
    foundUser.cart = [];
    const updatedUser = await foundUser.save();
    res.json({ updatedUser, newOrder });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allOrders = await Order.find({ user_id: id });
    res.json(allOrders);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.patch('/update-order-status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndUpdate(id, { isDelivered: true });
    const allOrders = await Order.find();
    res.json(allOrders)
  } catch (err) {
    res.status(400).send(err.message);
  }
})



module.exports = router;