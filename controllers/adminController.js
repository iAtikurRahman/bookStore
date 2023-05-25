// controllers/adminController.js
const Book = require('../models/Book');

// Add a book
exports.addBook = async (req, res) => {
  try {
    const { book_name, cover_image, author_name, isbn, genres, publisher, quantity, price } = req.body;

    const book = new Book({ book_name, cover_image, author_name, isbn, genres, publisher, quantity, price });
    await book.save();

    res.status(201).json({ message: 'Book added successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the book.' });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, cover_image, author_name, isbn, genres, publisher, quantity, price } = req.body;

    const book = await Book.findByIdAndUpdate(id, { book_name, cover_image, author_name, isbn, genres, publisher, quantity, price });
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ message: 'Book updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the book.' });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the book.' });
  }
};
