const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to get the list of books available using Promise callbacks
const getBookListAsync = async(callback) => {
    try{
        setTimeout(() => {
            if (books) {
                callback(null. books);
            }
            else{
                callback(new Error("Failed to retrieve book list"), null);
            }
        }, 5000);
  }
  catch{
    callback(error, null);
  }
};

// Function to get book details based on ISBN using Promise callbacks
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      }
      else {
        reject(new Error("Book ISBN not found"));
      }
    }, 5000);
  });
};

// Function to get book details based on author using Promise callbacks
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookDetails = Object.values(books).filter(book => book.author === author);
      if (bookDetails.length > 0) {
        resolve(bookDetails);
      }
      else {
        reject(new Error("Books by author not found"));
      }
    }, 5000);
  });
};

// Function to get book details based on title using Promise callbacks
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookDetails = Object.values(books).filter(book => book.title === title);
      if (bookDetails.length > 0) {
        resolve(bookDetails);
      }
      else {
        reject(new Error("Books by title not found"));
      }
    }, 5000);
  });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    getBookListAsync((error, bookList) => {
        if(error){
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json({
            message: "Book list retrieved successfully",
            books: bookList,
        });
    });
});

// Function to search for a book by ISBN using promises
const searchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        // Check if the book with the given ISBN exists
        if (books[isbn]) {
            resolve(books[isbn]); // Resolve with book details if found
        }
        else {
            reject(new Error("Book not found")); // Reject with error if not found
        }
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try{
    const bookDetails = await searchBookByISBN(isbn);
    return res.status(200).json({
      message: "Book ISBN retrieved successfully",
      book: bookDetails,
    });
  }
  catch(error){
    return res.status(404).json({
        message: "Book ISBN not found",
      });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try{
    const bookDetails = await getBooksByAuthor(author);
    return res.status(200).json({
        message: "Books by author retrieved successfully",
        books: bookDetails,
    });
  }
  catch(error){
    return res.status(404).json({
        message: error.message,
      });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try{
    const bookDetails = await getBooksByTitle(title);
    return res.status(200).json({
        message: "Books by title retrieved successfully",
        books: bookDetails,
    });
  }
  catch(error){
    return res.status(404).json({
        message: error.message,
      });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    return res.status(200).json({
      message: "Book reviews retrieved successfully",
      isbn: isbn,
      reviews: reviews
    });
  } else {
    return res.status(404).json({
      message: "Book with isbn " + isbn + " not found"
    });
  }
});

module.exports.general = public_users;