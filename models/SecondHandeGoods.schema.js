const mongoose = require("mongoose");


const SecondHandGoodsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true },
    tradePlace: { type: String, required: true },
    publishUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    contact: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["selling", "sold"],
        default: "selling",
    }
}, { timestamps: true });


const SecondHandGoods = mongoose.model("SecondHandGoods", SecondHandGoodsSchema);

module.exports = {
    SecondHandGoods
}