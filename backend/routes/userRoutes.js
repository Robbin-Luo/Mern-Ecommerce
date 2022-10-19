const router = require('express').Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { email, mobile, password } = req.body;
  try {
    const newUser = await User.create({ email, mobile, password });
    res.json(newUser);

  } catch (err) {
    console.log(err.code);
    if (err.code === 11000) {
      return res.status(400).send('Email already exsits');
    } else {
      res.status(400).send(err.message);
    }
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findByCredentials(email, password);
    res.json(foundUser)
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.post('/:id/delete-cart', async (req, res) => {
  const { id } = req.params;
  const { _id } = req.body.product;
  try {
    const foundUser = await User.findById(id);

    const foundProductOfUser = foundUser.cart.find((item) => item.product._id === _id);

    if (!foundProductOfUser) {
      return
    } else {
      foundUser.cart = foundUser.cart.filter((item) => item.product._id !== _id)
    }
    const updatedFoundUser = await foundUser.save();
    res.json(updatedFoundUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.post('/:id/update-cart', async (req, res) => {
  const { id } = req.params;
  const { product, quantity } = req.body;
  try {
    const foundUser = await User.findById(id);
    const foundProductOfUser = foundUser.cart.find((item) => item.product.name === product.name);
    if (!foundProductOfUser) {
      foundUser.cart.push({ product, quantity })
    } else {
      foundProductOfUser.quantity = foundProductOfUser.quantity * 1 + quantity * 1;
    }
    const updatedFoundUser = await foundUser.save();
    res.json(updatedFoundUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find({ isAdmin: false }).populate('orders');
    res.json(allUsers);
  } catch (err) {
    res.status(400).send(err.message)
  }
})


module.exports = router;