const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInputObjectType,
  } = require("graphql");
  const Room = require("./models/product");
  const Booking = require("./models/purchase");
  