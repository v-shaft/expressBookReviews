const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//check validity of username
const isValid = (username) => {
  let matchingUsers = users.filter((user) => {
    return user.username === username;
  });
  if (matchingUsers.length > 0) {
    return false;
  }
  return true;
};

//check if user & pass are already registered in database
const authenticatedUser = (username, password) => {
  let matchingUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (matchingUsers.length > 0) {
    return true;
  }
  return false;
};

// login available only for registered users
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Error: login unsuccessful");
  }

  // Check if the user credentials already exist in database
  if (authenticatedUser(username, password)) {
    // Generate JWT token.
    let accessToken = jwt.sign(
      {
        pw: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authenticated = {
      accessToken,
      username,
    };

    return res.status(200).send("Success! Logged in.");
  } else {
    return res
      .status(208)
      .send("Error... username or password invalid");
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  const bookISBN = req.params.isbn;
  const userReview = req.params.review;

  const currentUser = req.session.authenticated.username;
  let bookReviews = books[bookISBN].reviews;
  let reviewExists = false;
  for (const username in bookReviews) {
    if (username === currentUser) {
      bookReviews[currentUser] = userReview;
      reviewExists = true;
      break;
    }
  }
  
  if (!reviewExists) {
    bookReviews[currentUser] = userReview;
  }
  
  res.send("Review added/updated successfully!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookISBN = req.params.isbn;

  const currentUser = req.session.authenticated.username;
  const bookReviews = books[bookISBN].reviews;

  let reviewExists = false;
  for (const username in bookReviews) {
    if (username === currentUser) {
      delete bookReviews[currentUser];
      reviewExists = true;
      break;
    }
  }
  
  if (!reviewExists) {
    res.send("Error... Cannot delete a review that does not exist.");
  }
  res.send("Review deleted successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
