require("dotenv").config();

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {schema, root} = require('./graphql/schema');
const {authenticateJWT} = require("./middlewares/authenticateToken.middleware");
const mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT || 5121;
app.use(express.json({limit: '50mb'}));


app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { user: req.user }
})));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT , () => console.log(`Server running on http://localhost:${PORT}/graphql`));
    });
