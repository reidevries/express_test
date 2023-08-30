let pg_pool;

module.exports = (injected_pg_pool) => {
	pg_pool = injected_pg_pool;

	return {
		create_user,
		read_user,
		read_user_by_username,
	};
};

function create_user(username, password_hash, password_salt, callback) {
	const query = `INSERT INTO users (username, password_hash, password_salt)`
		+ ` VALUES ('${username}', '${password_hash}', '${password_salt}')`;
	pg_pool.query(query, callback);
}

function read_user(id, callback) {
	const query = `SELECT * FROM users WHERE id = '${id}'`;
	pg_pool.query(query, callback);
}

function read_user_by_username(username, callback) {
	const query = `SELECT * FROM users WHERE username = '${username}'`;
	pg_pool.query(query, callback);
}
