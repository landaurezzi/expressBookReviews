const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let checkUser = users.filter((user)=>{
        return user.username === username
    });
    if(checkUser.length > 0){
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let verifUser = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(verifUser.length > 0){
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in: username and password are required"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 
    'access', { expiresIn: 100 * 100 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  let user_r = users.filter(user => user.password == req.user.data)[0];
  books[isbn].reviews[user_r.username] = review;
  return res.status(200).json({message: `Review for book's isbn ${isbn} has been added`});
});

// Delete a book review
regd_users.delete("/auth/deletereview/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let user_r = users.filter(user => user.password == req.user.data)[0];
    delete books[isbn].reviews[user_r.username];
    return res.status(200).json({message: `Review for book's isbn ${isbn} has been deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
