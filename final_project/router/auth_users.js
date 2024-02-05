const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// task 6
let users = [{
  username: "user1",
  password: "pass1"
}];

const isValid = (username)=>{ //returns boolean
  let userWithUsername = users.filter((user)=>
    user.username===username
    );
  if(userWithUsername.length>0){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let authUser = users.filter((user)=>
  user.username===username && user.password===password
  );
  if(authUser.length>0){  
    return true;
  }
  else
  { 
    return false;
  }
}

// task 7 - only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username||!password){
    return res.status(400).json({message: "User not registered!"});
  }

  if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      username:username      
    }, 'access',{expiresIn:60*60});
    req.session.authorization={
      accessToken,username
    }
    return res.status(200).json({message: "Login successful!"});
  }
  else
  {
    return res.status(400).json({message: "Invalid login credentials!"});
  }
});

// task 8 - Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  const review = req.body.review;
  if(!isbn||!username||!review){
    return res.status(400).json({message: "Something went wrong. Please try again."});
  }
  if(!isValid(username)){
    return res.status(400).json({message: "Invalid username"});
  }
  if(!books[isbn]){
    return res.status(400).json({message: "Invalid ISBN"});
  }
  books[isbn].reviews[username]=review;
  return res.status(200).json({message: "Review added successfully"});
});

// task 9 - Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  if(!isbn||!username){
    return res.status(400).json({message: "Something went wrong. Please try again."});
  }
  if(!isValid(username)){
    return res.status(400).json({message: "Invalid username"});   
  }
  if(!books[isbn]){
    return res.status(400).json({message: "Invalid ISBN"});
  }
  delete books[isbn].reviews[username];
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;