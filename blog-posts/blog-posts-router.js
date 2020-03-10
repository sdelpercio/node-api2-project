const express = require('express');
const db = require('../data/db');

const router = express.Router();

// GET all blog posts
router.get('/', (req, res) => {
	db.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(error => {
			console.log('error from get all blog posts', error);
			res
				.status(500)
				.json({ error: 'The posts information could not be retrieved.' });
		});
});

// GET a single blog post
router.get('/:id', (req, res) => {
	db.findById(req.params.id)
		.then(post => {
			if (post.length !== 0) {
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

// GET all comments for a blog post
router.get('/:id/comments', (req, res) => {
	if (!req.params.id) {
		res.status(400).json({ error: 'please include an id in the URL' });
	} else {
		db.findPostComments(req.params.id)
			.then(comments => {
				if (!comments) {
					res
						.status(404)
						.json({ error: 'The post with the specified ID does not exist.' });
				} else {
					res.status(200).json(comments);
				}
			})
			.catch(error => {
				console.log('error for blog post comments', error);
				res
					.status(500)
					.json({ error: 'The comments information could not be retrieved.' });
			});
	}
});

// POST a new blog post
router.post('/', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res
			.status(400)
			.json({ error: 'Please provide title and contents for the post' });
	} else {
		db.insert(req.body)
			.then(postID => {
				res.status(201).json(postID);
			})
			.catch(error => {
				console.log('post blog post error', error);
				res.status(500).json({
					error: 'There was an error while saving the post to the database'
				});
			});
	}
});

// POST a new blog post comment
router.post('/:id/comments', (req, res) => {
	if (!req.params.id || !req.body.text || !req.body.post_id) {
		res
			.status(400)
			.json({ error: 'Please provide title and contents for the post' });
	} else {
		// add new comment to blog post
		db.insertComment(req.body)
			.then(commentID => {
				res.status(201).json(commentID);
			})
			.catch(error => {
				console.log('comment post error', error);
				res.status(404).json({
					error: 'The post with the specified ID does not exist.'
				});
			});
	}
});

// UPDATE a blog post
router.put('/:id', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res
			.status(400)
			.json({ error: 'Please provide title and contents for the post.' });
	} else {
		db.update(req.params.id, req.body)
			.then(() => {
				db.findById(req.params.id)
					.then(post => {
						res.status(200).json(post);
					})
					.catch(error => {
						res
							.status(500)
							.json({ error: 'The updated post could not be found', err });
					});
			})
			.catch(error => {
				console.log('error from update post', error);
				res
					.status(500)
					.json({ error: 'The post information could not be modified' });
			});
	}
});

// DELETE a blog post
router.delete('/:id', (req, res) => {
	db.findById(req.params.id)
		.then(selectedPost => {
			db.remove(req.params.id)
				.then(() => {
					res.status(200).json(selectedPost);
				})
				.catch(error => {
					console.log('error from removing post', error);
					res.status(500).json({ error: 'The post could not be removed.' });
				});
		})
		.catch(error => {
			res
				.status(404)
				.json({ error: 'The post with the specified ID does not exist.' });
		});
});

module.exports = router;
