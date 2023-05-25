// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const session = require('express-session');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { authenticate } = require('./middlewares/authMiddleware');


const app = express();
const PORT = 3000;
dotenv.config();
const URL=process.env.DATABASE_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/order', require('./routes/order'));

app.use(errorHandler);
app.use(authenticate);
app.use(session({resave: true, saveUninitialized: true, secret: 'XCR3rsasa%RDHHH', cookie: { maxAge: 60000 }}));
app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
