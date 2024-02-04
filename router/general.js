const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  const jsonString = books;
  console.log(jsonString);

  return res.status(200).json({
    message: "Book list retrieved successfully",
    books: jsonString,
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;

    if(books[isbn]){
        const bookDetails = books[isbn];
        return res.status(200).json({
            message: "Book isbn retrieved successfully",
            book: bookDetails,
        });
    }
    else{
        return res.status(404).json({
            message: "Book isbn not found",
        });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookDetails = [];

  Object.keys(books).forEach(key => {
    const book = books[key];
    if(book.author == author){
        bookDetails.push({
            isbn: key,
            author: book.author,
            title: book.title,
            reviews: book.reviews
        });
    }
  });

  if(bookDetails.length > 0){
    return res.status(200).json({
        message: "Book author retrieved successfully",
        books: bookDetails
    });
  }
  else{
    return res.status(404).json({
        message: "Book author not found"
    });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookDetails = [];

  Object.keys(books).forEach(key => {
    const book = books[key];
    if(book.title == title){
        bookDetails.push({
            isbn: key,
            author: book.author,
            title: book.title,
            reviews: book.reviews
        });
    }
  });
  if(bookDetails.length > 0){
    return res.status(200).json({
        message: "Book title retrieved successfuly",
        books: bookDetails
    });
  }
  else{
    return res.status(404).json({
        message: "Book title not found"
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    const reviews = book.reviews;
    return res.status(200).json({
        message: "Book reviews retrieved successfully",
        isbn: isbn,
        reviews: reviews
    });
  }
  else{
    return res.status(404).json({
        message: "Book with isbn " + isbn + " not found"
    });
  }
});

module.exports.general = public_users;