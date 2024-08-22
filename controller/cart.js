const Listing = require("../models/listing");
const Cart = require("../models/cart");

module.exports.saveCart = async (req, res) => {
  const { listingId, quantity } = req.body;
  const userId = req.user._id;
  // console.log(listingId, quantity, userId);

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.listing.toString() === listingId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ listing: listingId, quantity });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * listing.price,
      0
    );

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.listing");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.render("listings/cart.ejs", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
