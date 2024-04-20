const mongoose = require("mongoose");


const SecondHandGoodsOrderSchema = new mongoose.Schema({
    goods: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SecondHandGoods' },
    buyer: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    contact: { type: String, required: true },
}, { timestamps: true });

const SecondHandGoodsOrder = mongoose.model("SecondHandGoodsOrder", SecondHandGoodsOrderSchema);

module.exports = {
    SecondHandGoodsOrder
}