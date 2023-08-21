'use strict';

/**
 * Module dependencies
 */

var express = require('express');
var hash = require('pbkdf2-password')()
var path = require('path');
var router = express.Router();

// dummy database
var users = {
	broomhilda: { name: 'broomhilda' }	
};

// set up the hash function to hash a given password
hash({ password: 'foobar' }, function (err, pass, salt, hash) {
	if (err) throw err;

	// store the salt and hash in the mock db
	users.broomhilda.salt = salt;
	users.broomhilda.hash = hash;
});

// mock authentication function using mock database
function authenticate(name, password, fn) {
	if (!module.parent) console.log('authenticating %s:%s', name, password);
	var user = users[name];
	
	// 'query' the 'db' for the given username
	if (!user) return fn(null, null)

	// apply the hash function to the password / salt, if there is a match
	// we authenticated succesfully
	hash(
		{ password: password, salt: user.salt },
		function (err, password, salt, hash)
	{
		if (err) return fn(err)
		if (hash === user.hash) return fn(null, user)
		fn(null, null)
	});
}

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/auth/login');
	}
}

/* GET restricted to logged-in users page */
router.get('/restricted', restrict, function(req, res) {
	res.send('Logged in! click to <a href="/auth/logout">logout</a>');
});

/* GET logout page */
router.get('/logout', function(req, res) {
	// destroy the users session to log them out
	req.session.destroy(function(){
		res.redirect('/');
	});
});

/* GET login page */
router.get('/login', function(req, res) {
	res.render('login');
});

/* POST login details to authenticate */
router.post('/login', function(req, res, next) {
	authenticate(req.body.username, req.body.password, function(err, user) {
		console.log(users);
		if (err) return next(err)
		if (user) {
			// Regenerate session when signing in to prevent fixation (?)
			req.session.regenerate(function() {
				// Store the user's primary key in the session store to be
				// retrieved or in this case the entire user object
				req.session.user = user;
				req.session.success = 'Authenticated as ' + user.name
					+ ' click to <a href="/auth/logout">logout</a>. '
					+ ' click to access'
					+ ' <a href="/restricted">restricted page </a>.';
				res.redirect('back');
			});
		} else {
			req.session.error = 'Authentication failed, please check your'
				+ ' username and password.';
			res.redirect('/auth/login');
		}
	});
});

module.exports = router;
