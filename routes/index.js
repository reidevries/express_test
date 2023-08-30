module.exports = (router) => {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', { 
			title: 'Express', 
			message: '<a href="/auth/login">login</a>'
		});
	});

	return router;
}
