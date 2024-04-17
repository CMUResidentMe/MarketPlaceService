const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("schema");

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      return { user: req.user, role: req.user.role };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen({ port: 4000 }, () => {
    console.log(
      `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
}

startServer();