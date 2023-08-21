var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express', 
		message: '<a href="/auth/login">login</a>'
	});
});

module.exports = router;
