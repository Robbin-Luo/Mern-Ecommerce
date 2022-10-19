const cloudinary = require('cloudinary');
const router = require('express').Router();
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.apiKey,
  api_secret: process.env.apiSecret
})

router.delete('/:public_id', async (req, res) => {
  const { public_id } = req.params;
  try {
    await cloudinary.uploader.destroy(public_id);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message)
  }
});

module.exports = router;