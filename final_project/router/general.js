const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: registering a new user
public_users.post("/register", (req, res) => {
  // Get credentials
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password exist
  if (username.length > 0 && password.length > 0) {
    // Check if user is already registered
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "Registration successful" });
    } else {
      return res.status(406).json({ message: "Error... User already exists" });
    }
  }
  return res.status(406).json({ message: "Error... missing username or password" });
});

// Task 1: Get list of books available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

// Task 10: Promise callbacks or async-await with Axios
public_users.get("/async", function (req, res) {
  const getBooks = new Promise(() => {
    res.send(JSON.stringify({ books }));
  });

  getBooks.then(() => console.log("Task 10: Promise callbacks or async-await with Axios successful"))
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  res.send(books[bookISBN]);
});

// Task 11: Promise callbacks or async-await with Axios
public_users.get("/async/isbn/:isbn", function (req, res) {
  const getBook = new Promise(() => {
    const bookISBN = req.params.isbn;
    res.send(books[bookISBN]);
  });

  getBook.then(() => console.log("Task 11: Promise callbacks or async-await with Axios successful"))
});

// Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const allBooksByAuthor = Object.entries(books);
  const finalBooks = [];

  // Find which values match the author
  for (const [key, value] of allBooksByAuthor) {
    if (value.author === author) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

// Task 12: Promise callbacks or async-await with Axios
public_users.get("/async/author/:author", function (req, res) {
  const getAuthorsBooks = new Promise(() => {
    const author = req.params.author;
    const allBooksByAuthor = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the author
    for (const [key, value] of allBooksByAuthor) {
      if (value.author === author) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  })

  getAuthorsBooks.then(() => console.log("Task 12: Promise callbacks or async-await with Axios successful"))
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const allBooksByTitle = Object.entries(books);
  const finalBooks = [];

  // Find which values match the title
  for (const [key, value] of allBooksByTitle) {
    if (value.title === title) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

// Task 13: Promise callbacks or async-await with Axios
public_users.get("/async/title/:title", function (req, res) {
  const getBookTitles = new Promise(() => {
    const title = req.params.title;
    const allBooksByTitle = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the title
    for (const [key, value] of allBooksByTitle) {
      if (value.title === title) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });

  getBookTitles.then(() => console.log("Task 13: Promise callbacks or async-await with Axios successful"))
});

// Task 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  const book = books[bookISBN];

  res.send(book.reviews);
});

module.exports.general = public_users;
