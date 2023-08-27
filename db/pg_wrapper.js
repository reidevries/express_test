const Pool = require("pg").Pool;

function query(query_str, callback) {
	const pool = new Pool({
		user: "postgres",
		host: "localhost",
		database: "express_test",
		password: "",
		port: 5432,
	});
	pool.query(query_str, (error, results)) => {
		callback({
			error: error,
			results: results ? results : null,
		});
	});
}

module.exports = {
	query,
};
