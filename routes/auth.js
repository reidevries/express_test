let authenticator;

module.exports = (router, injected_authenticator) => {
	authenticator = injected_authenticator;

	/* GET logout page */
	router.get('/logout', (req, res) => {
		// destroy the users session to log them out
		req.session.destroy(() => { res.redirect('/'); });
	});

	/* GET login page */
	router.get('/login', (req, res) => {
		if (req.session.user) {
			res.render(
				'login',
				{
					message: 'Currently logged in as ' + req.session.user.name
						+ '!',
					foot: '<a href="/auth/logout">logout</a>.' 
				}
			);
		} else {
			res.render(
				'login',
				{
					message: 'Not logged in.'
				}
			);
		}
	});

	/* POST login details to authenticate */
	router.post('/login', login_form_post); 

	return router;
}


function login_form_post(req, res, callback) {
	authenticator.authenticate(
		req.body.username, 
		req.body.password, 
		(err, user) => {
			console.log("err:");
			console.log(err);
			console.log("user:");
			console.log(user);
			if (err) return callback(err)
			if (user) {
				// Regenerate session when signing in to prevent fixation (?)
				req.session.regenerate(() => {
					// Store the user's primary key in the session store to be
					// retrieved or in this case the entire user object
					req.session.user = user;
					req.session.success = 'Authenticated as ' + user.name
						+ ' click to <a href="/auth/logout">logout</a>. ';
					res.redirect('back');
				});
			} else {
				req.session.error = 'Authentication failed, please check your'
					+ ' username and password.';
				res.redirect('/auth/login');
			}
		}
	)
}
