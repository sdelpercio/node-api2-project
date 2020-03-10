const express = require('express');
const db = require('../data/db');

const router = express.Router();

// GET all blog posts
router.get('/', (req, res) => {
	db.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(() => {
			res
				.status(500)
				.json({ error: 'The posts information could not be retrieved.' });
		});
});

// GET a single blog post
router.get('/:id', (req, res) => {
	db.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res
					.status(404)
					.json({ error: 'The post with the specified ID does not exist.' });
			}
		})
		.catch(error => {
			console.log(error);
			res
				.status(500)
				.json({ error: 'The post information could not be retrieved.' });
		});
});

module.exports = router;
