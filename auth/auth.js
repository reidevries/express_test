let hasher;
let db_users;

module.exports = (injected_hasher, injected_db_users) => {
	hasher = injected_hasher;
	db_users = injected_db_users;

	return {
		authenticate,
	};
}

function authenticate(username, password, callback) {
	db_users.read_user_by_username(username, (err, res) => {
		if (err) {
			return callback(err, null);
		}

		if (res?.rowCount != 1) {
			return callback(null, null);
		}

		// username found, presumably
		const user = res.rows[0];

		hasher(
			{ password: password, salt: user.password_salt},
			(hash_err, password, salt, hash) => {
				if (hash_err) return callback(hash_err);
				if (hash === user.password_hash) return callback(null, user);
				console.log("password mismatch");
				return callback(null, null);
			}
		);
	});
}
