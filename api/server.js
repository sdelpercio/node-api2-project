const express = require('express');
const blogPostsRouter = require('../blog-posts/blog-posts-router');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
	res.status(200).send('Node API 2 Afternoon Project');
});

server.use('/api/posts', blogPostsRouter);

module.exports = server;
