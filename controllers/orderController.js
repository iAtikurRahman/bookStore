const { stripeSecretKey } = require('../config/config');
const stripe = require('stripe')(stripeSecretKey);
const Order = require('../models/Order');


// Controller for retrieving all books
exports.getAllBooks = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find the user's order by email
      const userOrder = await Order.findOne({ email });
  
      if (!userOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Extract the list of all books from the user's order
      const allBooks = userOrder.orders.reduce((books, order) => {
        return books.concat(order.products);
      }, []);
  
      res.status(200).json({ allBooks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving all books' });
    }
  };

// Controller for handling user purchases
exports.purchaseBook = async (req, res) => {
  try {
    const { email, orderId, purchaseDate, bookId, price } = req.body;

    // Find the user's order by email
    let userOrder = await Order.findOne({ email });

    if (!userOrder) {
      // If the order doesn't exist, create a new order for the user
      userOrder = new Order({
        email,
        orders: [],
      });
    }

    // Add the purchased book to the user's order
    userOrder.orders.push({
      orderId,
      purchaseDate,
      products: [{ bookId, price }],
      price,
      isPaid: false,
    });

    // Save the updated order
    await userOrder.save();

    // Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe requires the amount in cents
      currency: 'usd', // Replace with your desired currency
      metadata: { orderId },
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error purchasing book' });
  }
};

// Controller for handling user wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { email, bookId } = req.body;

    // Find the user's order by email
    let userOrder = await Order.findOne({ email });

    if (!userOrder) {
      // If the order doesn't exist, create a new order for the user
      userOrder = new Order({
        email,
        orders: [],
      });
    }

    // Check if the book is already in the wishlist
    const wishlistIndex = userOrder.orders.findIndex(
      (order) => order.products[0].bookId === bookId
    );

    if (wishlistIndex !== -1) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    // Add the book to the user's wishlist
    userOrder.orders.push({
      products: [{ bookId }],
    });

    // Save the updated order
    await userOrder.save();

    res.status(201).json({ message: 'Book added to wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding book to wishlist' });
  }
};

// Controller for handling user payments
exports.makePayment = async (req, res) => {
  try {
    const { email, orderId, paymentMethod } = req.body;

    // Find the user's order by email
    const userOrder = await Order.findOne({ email });

    if (!userOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the specific order in the user's order list
    const order = userOrder.orders.find((order) => order.orderId === orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve the Payment Intent client secret from the frontend
    const { clientSecret } = req.body;

    // Confirm the payment using the client secret and payment method
    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethod,
    });

    if (paymentIntent.status === 'succeeded') {
      // Update the payment status of the order to true
      order.isPaid = true;

      // Save the updated order
      await userOrder.save();

      res.status(200).json({ message: 'Payment successful' });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error making payment' });
  }
};
