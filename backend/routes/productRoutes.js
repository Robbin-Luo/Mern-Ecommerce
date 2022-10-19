const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find().limit(6);
    res.json(allProducts)
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:category/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = await Product.findById(id);
    const similarProducts = await Product.find({ category: foundProduct.category }).limit(4);
    const similar = similarProducts.filter((pro) => { return pro.name !== foundProduct.name })
    res.json({ foundProduct, similar });
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  try {
    const searchResult = await Product.find({ name: { $regex: keyword, $options: '$i' } });
    res.json(searchResult);
  } catch (err) {
    res.status(400).send(err.message);
  }

})

router.get('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const foundProducts = await Product.find({ category });
    res.json(foundProducts);
  } catch (err) {
    res.status(400).send(err.message);
  }
})



router.post('/add-new-product', async (req, res) => {
  const { name, specification, description, price, quantity, category, pictures } = req.body;
  try {
    await Product.create({ name, specification, description, price, stock: quantity, category, pictures });
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { userId } = req.body;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser.isAdmin) {
      return res.status(401).send('You are not authorized to do so')
    } else {
      await Product.findByIdAndDelete(id);
      const restProducts = await Product.find();
      res.json(restProducts)
    }
  } catch (err) {
    res.status(400).send(err.message)
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { newPrice, newStock } = req.body;
  const foundProduct = await Product.findById(id);
  foundProduct.stock = newStock * 1 + foundProduct.stock * 1;
  if (newPrice > 0) {
    foundProduct.price = newPrice;
  }
  try {
    await foundProduct.save();
    const updatedProduct = await Product.find({ _id: id });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

module.exports = router;