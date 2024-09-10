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

// Modify quantity in the cart
// module.exports.updateCartQuantity = async (req, res) => {
//   const { listingId, quantity } = req.body;
//   const userId = req.user._id;

//   try {
//     let cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     const item = cart.items.find(
//       (item) => item.listing.toString() === listingId
//     );
//     if (!item) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Item not found in cart" });
//     }

//     if (quantity <= 0) {
//       cart.items = cart.items.filter(
//         (item) => item.listing.toString() !== listingId
//       );
//     } else {
//       item.quantity = quantity;
//     }

//     cart.totalAmount = cart.items.reduce(
//       (sum, item) => sum + item.quantity * item.listing.price,
//       0
//     );

//     await cart.save();
//     res.json({ success: true, cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Delete item from cart
// module.exports.deleteCartItem = async (req, res) => {
//   const { listingId } = req.body;
//   const userId = req.user._id;

//   try {
//     let cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.listing.toString() !== listingId
//     );

//     cart.totalAmount = cart.items.reduce(
//       (sum, item) => sum + item.quantity * item.listing.price,
//       0
//     );

//     await cart.save();
//     res.json({ success: true, cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

module.exports.updateCartQuantity = async (req, res) => {
  const { listingId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.listing.toString() === listingId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.listing.toString() !== listingId
      );
    } else {
      item.quantity = quantity;
    }

    // Recalculate totalAmount with async/await properly
    let totalAmount = 0;
    for (const cartItem of cart.items) {
      const listing = await Listing.findById(cartItem.listing);
      totalAmount += cartItem.quantity * (listing ? listing.price : 0);
    }
    cart.totalAmount = totalAmount;

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.deleteCartItem = async (req, res) => {
  const { listingId } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.listing.toString() !== listingId
    );

    // Recalculate totalAmount with async/await properly
    let totalAmount = 0;
    for (const cartItem of cart.items) {
      const listing = await Listing.findById(cartItem.listing);
      totalAmount += cartItem.quantity * (listing ? listing.price : 0);
    }
    cart.totalAmount = totalAmount;

    await cart.save();
    res.json({ success: true, cart });
    // req.falsh("success", "listing deleted");
    req.flash("success", "Listing deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
