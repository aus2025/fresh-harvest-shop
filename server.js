const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the products order page
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'order.html'));
});

// Serve the cart page
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

// Serve the checkout page
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

// Serve the payment page
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

// Handle order submission
app.post('/submit-order', (req, res) => {
  // Simple handling - in a real app, you'd save to a database
  console.log('Order received:', req.body);
  res.redirect('/payment');
});

// Handle payment
app.post('/process-payment', (req, res) => {
  // This would connect to a payment processor in a real app
  console.log('Payment processed:', req.body);
  res.sendFile(path.join(__dirname, 'views', 'confirmation.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});