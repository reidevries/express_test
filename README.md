# Express Test Respository
With this repo, I'm documenting my journey learning Express framework!

# What I've done:

### 1. Implement a basic test endpoint from scratch
### 2. Generated a project using express
### 3. Implement basic login
To do this I used PBKDF2 hashing. I also created a login template page using
handlebars. The code for authorization is in `/routes/auth.js` for now.
I used a mock database instead of a real one.
In future I would put authorization functions in a separate utility module so
that we can use it across all endpoints easily.
You can visit the `/auth/restricted` endpoint to test if you have authorization.

# Next steps:
Next I plan to implement a registration endpoint and get it hooked up to a real
database (PostgreSQL most likely).

