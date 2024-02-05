const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  if(isValid(req.body.username)){
    return res.status(400).json({message: "Username already taken! Choose another one"});
  }
  else
  {
    let user = {
      username: req.body.username,
      password: req.body.password
    }
    users.push(user);
    return res.status(200).json({message: "Registration successful"});
  }
});

// task 1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
});

// task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn])
  
 });
  
// task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let author = req.params.author;
  let arr = Object.entries(books)
  const book_author = new Promise((resolve, reject)=>{

    let book_by_author = arr.filter((item)=>item[1].author === author)
    if(book_by_author)
    {
      resolve(book_by_author)
    }
    else{
      reject({message: `Author not found: ${author}`})
    }
  })

  book_author.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});

// task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let arr = Object.entries(books)

  const book_title = new Promise((resolve,reject)=>{
    let book_by_title = arr.filter((item)=>item[1].title === title)
    if(book_by_title)
    {
      resolve(book_by_title[0][1])
    }
    else
    {
      reject({message: `Book by title not found: ${title}` })
    }
  });

  book_title.then((resp)=>{
    res.status(200).json(resp)
    }).catch(err=>res.status(403).json({error: err}))
});

//  task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews))
});

// task 10
let url="https://teokos1989-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/";
const getBookDetails=async(url)=>{
      let resp = await axios.get(url);
      let books = resp.data;
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}

// task 11
url="https://teokos1989-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/";
const getBookDetailsByISBN=async(url,isbn)=>{
      let resp = await axios.get(url+isbn);
      let book = resp.data;
      console.log(book[isbn]);
}

//task 12
url="https://teokos1989-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/";
const getBookDetailsByAuthor=async(url,author)=>{
      let resp = await axios.get(url+author);
      let books = resp.data;
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}

// task 13
url="https://teokos1989-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/";
const getBookDetailsByTitle=async(url,title)=>{
      let resp = await axios.get(url+title);
      let books = resp.data;  
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}

module.exports.general = public_users;