const express = require("express");
const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server-express");
const axios = require("axios");

async function fetchSchemaFromAPIGateway(apiGatewayURL) {
  try {
    const response = await axios.post(apiGatewayURL, {
      query: `{
        __schema {
          types {
            name
          }
        }
      }`
    });
    // Use the data from the response to construct your schema
    const schema = makeExecutableSchema({
      typeDefs: gql`${response.data.data.__schema}`,
      // You may also need resolvers if they are not part of the introspection response
    });
    return schema;
  } catch (error) {
    console.error("Error fetching schema from API Gateway:", error);
    throw new Error("Failed to fetch GraphQL schema from API Gateway");
  }
}

async function startServer() {
  const app = express();
  
  // Fetch the schema from API Gateway
  const schema = await fetchSchemaFromAPIGateway('http://localhost:2009/graphql');

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
