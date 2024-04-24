// Load environment variables from the .env file.
require("dotenv").config();

// Import the express module to create and manage the server.
const express = require('express');
// Import the express-graphql middleware to create a GraphQL HTTP server.
const { graphqlHTTP } = require('express-graphql');
// Import the GraphQL schema and resolver definitions.
const { schema, root } = require('./graphql/schema');
// Import the JWT authentication middleware.
const { authenticateJWT } = require("./middlewares/authenticateToken.middleware");
// Import the mongoose module to interact with MongoDB.
const mongoose = require("mongoose");

// Create an Express application.
const app = express();
// Define the default port to listen on, or get it from environment variables.
const PORT = process.env.PORT || 5121;
// Middleware to parse incoming JSON requests with a body size limit.
app.use(express.json({ limit: '50mb' }));

// Setup GraphQL endpoint with express-graphql as middleware.
app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema, // The GraphQL schema.
    rootValue: root, // The resolver root functions.
    graphiql: true, // Enable GraphiQL interface for interactive querying.
    context: { user: req.user } // Pass the user info to resolvers via context.
})));

// Connect to MongoDB using the URI stored in environment variables.
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // Log successful database connection.
        console.log("MongoDB connected");
        app.listen(PORT , () => console.log(`Server running on http://localhost:${PORT}/graphql`));
    });
