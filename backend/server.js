require('dotenv').config()
require('./connection')
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: '*', methods: '*' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const imageRoutes = require('./routes/imageRoutes');
const orderRouter = require('./routes/orderRoutes');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/images', imageRoutes);
app.use('/orders', orderRouter);

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(totalAmount * 100),
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


const PORT = process.env.PORT || 3001
server.listen(PORT, () => { console.log(`server is running on ${PORT}`) })