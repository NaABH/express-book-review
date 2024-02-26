const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(200).json({message: "User already exists"});
    } else {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10
public_users.get('/task10', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/');
      const books = response.data;
      res.send(JSON.stringify(books, null, 4));
  } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

 // Taks 11
public_users.get('/task11/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Replace 'http://api.example.com/books' with the actual API endpoint to fetch the list of books
      const books = response.data;
      if (books) {
        res.send(JSON.stringify(books, null, 4));
      } else {
        res.status(404).json({message: "Book not found"});
      }
  } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let author_books = [];
  for (const isbn in books) {
    if (Object.hasOwnProperty.call(books, isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        author_books.push(book);
      }
    }
  if (author_books.length === 0) {
    return res.status(404).json({message: "Author not found"});
  } else {
    return res.status(200).json(author_books);
  }
}});

 // Taks 12
 public_users.get('/task12/:author', async function (req, res) {
  let author = req.params.author;
  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`); // Replace 'http://api.example.com/books' with the actual API endpoint to fetch the list of books
      const books = response.data;
      if (books) {
        res.send(JSON.stringify(books, null, 4));
      } else {
        res.status(404).json({message: "Book not found"});
      }
  } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let title_books = [];
  for (const isbn in books) {
    if (Object.hasOwnProperty.call(books, isbn)) {
      const book = books[isbn];
      if (book.title === title) {
        title_books.push(book);
      }
    }
  if (title_books.length === 0) {
    return res.status(404).json({message: "Title not found"});
  } else {
    return res.status(200).json(title_books);
  }
}});

 // Taks 13
 public_users.get('/task13/:title', async function (req, res) {
  let title = req.params.title;
  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`); // Replace 'http://api.example.com/books' with the actual API endpoint to fetch the list of books
      const books = response.data;
      if (books) {
        res.send(JSON.stringify(books, null, 4));
      } else {
        res.status(404).json({message: "Book not found"});
      }
  } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
