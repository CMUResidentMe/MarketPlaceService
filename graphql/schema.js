const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { SecondHandGoods } = require('../models/SecondHandeGoods.schema');
const mongoose = require("mongoose");
const {SecondHandGoodsOrder} = require("../models/SecondHandGoodsOrder.schema");
const { KafkaService } = require("../KafkaService");
const schema = buildSchema(`
  type SecondHandGoods {
    id: ID!
    title: String!
    description: String!
    price: Float!
    image: String
    category: String!
    tradePlace: String!
    publishUser: String!
    contact: String!
    status: String!
    createdAt: String!
  }
  
  type SecondHandGoodsOrder {
    id: ID!
    goods: SecondHandGoods!
    buyer: String!
    contact: String!
    tradePlace: String!
  }

  type Query {
    getAllGoods: [SecondHandGoods]
    getGoodsByUser(publishUser: String!): [SecondHandGoods]
    getGoodsById(id: ID!): SecondHandGoods
    getOrdersByUser(userId: ID!): [SecondHandGoodsOrder]
    isGoodsOwner(goodsId: ID!, userId: ID!): Boolean
    getSoldOrdersByUser(publishUser: String!): [SecondHandGoodsOrder]
  }

  type Mutation {
    addGoods(title: String!, description: String!, price: Float!, image: String, category: String!, tradePlace: String!, contact: String!, publishUser: String!): SecondHandGoods
    updateGoods(id: ID!, title: String, description: String, price: Float, image: String, category: String, tradePlace: String, contact: String, publishUser: String!): SecondHandGoods
    deleteGoods(id: ID!, userId: String!): String
    buyGoods(goodsId: ID!, userId: ID!, contact: String!, tradePlace: String!): SecondHandGoodsOrder
  }
`);

const kafkaService = new KafkaService();
kafkaService.initService();
const root = {
    isGoodsOwner: async ({ goodsId, userId }) => {
        const goods = await SecondHandGoods.findById(goodsId);
        if (!goods) {
            throw new Error("No goods found with that ID");
        }
        return goods.publishUser.toString() === userId;
    },

    getAllGoods: async () => {
        return await SecondHandGoods.find();
    },
    getSoldOrdersByUser: async ({ publishUser }) => {
        const allOrders = await SecondHandGoodsOrder.find().populate("goods");
        return allOrders.filter(order => order.goods.publishUser.toString() === publishUser);
    },
    getGoodsByUser: async (args, context) => {
        const publishUser = args.publishUser;
        return await SecondHandGoods.find({ publishUser: new mongoose.mongo.ObjectId(publishUser) });
    },
    getGoodsById: async ({ id }, context) => {
        const goods = await SecondHandGoods.findById(id);
        if (!goods) {
            throw new Error("No goods found with that ID");
        }
        return goods;
    },
    addGoods: async ({ title, description, price, image, category, tradePlace, contact, publishUser }, context) => {
        const newGoods = new SecondHandGoods({
            title,
            description,
            price,
            image,
            category,
            tradePlace,
            publishUser: new mongoose.mongo.ObjectId(publishUser),
            contact
        });
        return await newGoods.save();
    },
    updateGoods: async ({ id, title, description, price, image, category, tradePlace, contact, publishUser }) => {
        const goods = await SecondHandGoods.findById(id);
        if (!goods) {
            throw new Error("No goods found with that ID");
        }
        if (goods.publishUser.toString() !== publishUser) {
            throw new Error("Unauthorized to update this item");
        }
        return await SecondHandGoods.findByIdAndUpdate(id, { title, description, price, image, category, tradePlace, contact }, { new: true });
    },
    deleteGoods: async ({ id, userId }) => {
        const goods = await SecondHandGoods.findById(id);
        if (!goods) {
            throw new Error("No goods found with that ID");
        }
        if (goods.publishUser.toString() !== userId) {
            throw new Error("Unauthorized to delete this item");
        }
        await SecondHandGoods.findByIdAndDelete(id);
        return "Goods successfully deleted";
    },
    buyGoods: async ({ goodsId, userId, contact, tradePlace }) => {
        const goods = await SecondHandGoods.findById(goodsId);
        if (!goods) {
            throw new Error("No goods found with that ID");
        }
        if (goods.publishUser.toString() === userId) {
            throw new Error("Cannot buy your own goods");
        }
        await SecondHandGoods.findByIdAndUpdate(goodsId, { status: "sold" });

        const order = await SecondHandGoodsOrder.create({
            goods: new mongoose.mongo.ObjectId(goodsId),
            buyer: new mongoose.mongo.ObjectId(userId),
            tradePlace,
            contact
        });

        await kafkaService.publishMessage(
            process.env.NOTIFICATION_TYPE,
            process.env.MarketPlace_TOPIC,
            `Your goods ${goods.title} has been sold, the buyer contact is ${contact} and trade place is ${tradePlace}`,
            `${goods.publishUser.toString()}`,
            order._id.toString()
        )
        return order;
    },
    getOrdersByUser: async ({ userId }) => {
        return await SecondHandGoodsOrder.find({ buyer: new mongoose.mongo.ObjectId(userId) }).populate("goods");
    }

};


module.exports = {
    schema,
    root
}

