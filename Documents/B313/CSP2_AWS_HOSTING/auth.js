const jwt = require("jsonwebtoken");
const secret = "e-commerce_api";

module.exports.createAccessToken = (user) => {
	// Creates a signature using the document (or the user) as reference received from userController.js. This will also be our token
	return jwt.sign({
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	},
	// Secret key is used to sign the token
	secret,
	// Adds an expriation date for the token
	{expiresIn: "12h"})
};

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);
	// Stores the bearer token
	let token = req.headers.authorization;

	// Checks if token variable has a value
	if(typeof token === "undefined"){
		return res.send({auth: "Failed. No Token."});
	} else {
		// If it has a value, it will:
		console.log(token);
		// 1. Remove the string "Bearer " to only take the token
		token = token.slice(7, token.length);

		console.log(token);
		/*
			In jwt.verify(),
			1. token
				- The token created using the user document from the database
			2. secret
				- The key that was used to sign JWT
				- This will be used to check if token is legit
			3. function(err, decodedToken){...}
				- If there is an error, it will send an error message
				- If it is successful, it will decode the token which contains the id, email, and isAdmin (which is now called the decodedToken) and attaches the decodedToken to req.user
				- It will then trigger next() which call the next middleware or route handler to proceed
		*/
		jwt.verify(token, secret, function(err, decodedToken){
			if(err){
				return res.send({auth: "Failed", message: err.message})
			} else {
				console.log(decodedToken);
				req.user = decodedToken;
				next();
			}
		})
	}
};

module.exports.verifyAdmin = (req, res, next) => {
	// You will input your JWT and this will extract and check if the isAdmin in the JWT is true
	if(req.user.isAdmin){
		// If true, it  will let you proceed
		next();
	} else {
		// If not true, send failed message
		return res.send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
};