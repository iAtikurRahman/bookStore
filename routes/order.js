const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route for user see all books
router.get('/books', orderController.getAllBooks);

// Route for user purchase
router.post('/purchase', orderController.purchaseBook);

// Route for adding book to wishlist
router.post('/wishlist', orderController.addToWishlist);

// Route for making payment
router.post('/payment', orderController.makePayment);

module.exports = router;
