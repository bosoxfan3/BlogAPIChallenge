'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();

BlogPosts.create('Romeo and Juliet', 'Two young people fall in love', 'William Shakespeare');
BlogPosts.create('The Maze Runner', 'Some homies need to escape a killer maze', 'James Dashner');

router.get('/', (req, res) => {
  const items = BlogPosts.get();
  res.json(items);
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Request is missing ${field}`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Item with id ${req.params.id} deleted`);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Request is missing ${field}`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = 'IDs do not match';
    console.error(message);
    return res.status(400).send(message);
  }
  BlogPosts.update({
    title: req.body.title,
    id: req.params.id,
    author: req.body.author,
    content: req.body.content
  });
  res.status(204).end();
});

module.exports = router;