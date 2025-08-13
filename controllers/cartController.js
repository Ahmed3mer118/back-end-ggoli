const Cart = require("../models/cart.model")
const Product = require("../models/product.model")
const mongoose = require("mongoose");


exports.addToCart = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { productId, quantity, sessionId } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        // جلب المنتج
        const product = await Product.findById(productId).session(session);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userId = req.user._id;

        // البحث عن العنصر في الكارت
        let cartItem = await Cart.findOne({
            userId,
            productId,
            isPurchased: false
        }).session(session);

        if (cartItem) {
            const priceChanged = product.price !== cartItem.currentPrice;

            cartItem = await Cart.findByIdAndUpdate(
                cartItem._id,
                {
                    quantity: cartItem.quantity + quantity,
                    currentPrice: product.price,
                    priceChanged: priceChanged || cartItem.priceChanged,
                    removedAt: null
                },
                { new: true, session }
            );
        } else {
            // التحقق من المخزون
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Cannot purchase this quantity. Only ${product.stock} in stock.`
                });
            }

            // إنشاء العنصر في الكارت
            cartItem = (
                await Cart.create([{
                    userId,
                    sessionId: req.user ? null : sessionId,
                    productId,
                    quantity,
                    price: product.price,
                    originalPrice: product.price,
                    currentPrice: product.price,
                }], { session })
            )[0];

            // تحديث المخزون
            await Product.findOneAndUpdate(
                { _id: productId, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true, session }
            );
        }

        await session.commitTransaction();

        let message = "Product added to cart successfully";
        if (cartItem.priceChanged) {
            message = "Product added to cart. Note: Price has changed since last time!";
        }

        return res.status(201).json({
            message,
            data: cartItem,
            priceChanged: cartItem.priceChanged
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error adding to cart:", error.message, error.stack);
        return res.status(500).json({
            error: "Server error while adding to cart.",
            details: error.message
        });
    } finally {
        session.endSession();
    }
};


exports.getUserProductInCart = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.user._id }).populate("productId", "product_title product_image stock")
        return res.status(200).json({ message: "Product in cart", data: cart });
    } catch (error) {
        res.status(500).json({
            error: "Server error while getting product in cart."
        });
    }
}
exports.getAllUserProductInCart = async (req, res) => {
    const cart = await Cart.find().populate('product user', "name email price  ");
    res.status(200).json({ message: "list of user purchases", data: cart })
}

exports.getAbandonedProducts = async (req, res) => {
    const abandoned = await Cart.find({
        isPurchased: false,
        removedAt: { $exists: true }
    }).populate("productId userId");

    res.status(200).json({ message: "Abandoned products", data: abandoned });
};

exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body;

        if (!id || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid cart item ID or quantity." });
        }

        const updatedCartItem = await Cart.findByIdAndUpdate(
            { _id: id },
            { quantity },
            { new: true }
        );
        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }
        return res.status(200).json({
            message: "Cart item updated successfully.",
            data: updatedCartItem
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error while updating cart item." });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
      const { id } = req.body;
  
      const cartItem = await Cart.findById(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      cartItem.quantity = 0;
      cartItem.removedAt = new Date();
      await cartItem.save();
  
      return res.status(200).json({ message: "Item removed from cart." });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error while removing from cart." });
    }
  };
  

exports.confirmPriceChange = async (req, res) => {
    try {
        const { id } = req.body;
        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }
        cartItem.priceChanged = false;
        cartItem.originalPrice = cartItem.currentPrice;
        cartItem.removedAt = null;

        await cartItem.save();
        return res.status(200).json({ message: "Price confirmed", data: cartItem });

    } catch (error) {
        return res.status(500).json({ message: "Server error while confirming price change." });
    }
}