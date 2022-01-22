const  mongoose  = require("mongoose");
const User = require("./user.model");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        pic: { type: String, required: false },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        }
    },
    {
        versionKey: false,
        timestamps: true,
        
    }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;