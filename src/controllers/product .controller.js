const express = require("express");
const anthenticate = require("../middlewares/aunthenticate");
const Product = require("../models/product.model");
const authorise = require("../middlewares/authorise");
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post("/",
    anthenticate,
    authorise(["seller","admin"]),
    async (req, res) => {
        try {
            const product = await Product.create(req.body);
            return res.status(400).send(product);
        }
        catch (err) {
            return res.status(500).send(err.message)
        }
    }
);

router.patch("/:id",
    body("user_id").notEmpty().withMessage("user_id is required")
        .custom( async(value, {req})=> {
            try {
                const user = await User.findById(value).lean().exec();
                if (!user)
                    return Promise.reject({ message: "user is not exist" });
                const product = await Product.findById(req.params.id).lean().exec();
                if (!product)
                    return Promise.reject({ message: "product is not exist" });
                if (!product.user_id.equals(user._id))
                    return Promise.reject({message:"you are not allowed to update this product"})
            }
            catch (err) {
                return Promise.reject(err.message);
                console.log(err)
            }
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array());
        }
        try {
            const user = await Product.findByIdAndUpdate(req.params.id, (req.body), { new: true });
            return res.status(201).send(user)
        }
        catch (err) {
            return res.status(500).send(err.message);
        }
    }
);

router.delete("/:id",
    body("user_id").notEmpty().withMessage("user_id is required")
        .custom(async(value, { req }) => {
            const user = await User.findById(value).lean().exec();
            if (!user)
                return Promise.reject({ message: "user is not exist" });
            const product = await Product.findById(req.params.id).lean().exec();
            
            if (!product)
                return Promise.reject({ message: "product is not exist " });
            if (!product.user_id.equals(user._id))
                return Promise.reject({ message: "you can't delet this product" });
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array());
        }
        try {
            const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
            const Deleted = "you successfully deleted this product";
            return res.status(201).send({Deleted,product});
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
    }
)

module.exports = router;