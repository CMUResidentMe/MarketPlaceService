// Import the jsonwebtoken package to manage JSON Web Tokens.
const jwt = require('jsonwebtoken');

// Define the middleware function to authenticate JSON Web Tokens in requests.
const authenticateJWT = (req, res, next) => {
    // Extract the authorization header from the incoming request.
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists.
    if (authHeader) {
        // Split the authorization header to extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token using the secret key stored in the environment variables.
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            // Handle the case where the token is invalid or expired.
            if (err) {
                return res.sendStatus(403); // Forbidden status if verification fails.
            }

            // If the token is valid, attach the decoded user information to the request object.
            req.user = user;
            next(); // Proceed to the next middleware or route handler.
        });
    } else {
        // Send a 401 Unauthorized status if no authorization header is present.
        res.sendStatus(401);
    }
};

// Export the authenticateJWT middleware to be used in other parts of the application.
module.exports = {
    authenticateJWT
}
