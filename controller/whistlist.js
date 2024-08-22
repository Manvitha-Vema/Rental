const User = require("../models/user");
const Wishlist = require("../models/whistlist");

module.exports.getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: "wishlist",
      populate: {
        path: "listings",
        model: "Listing",
      },
    });

    if (!user || !user.wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    res.render("listings/whistlist.ejs", { wishlist: user.wishlist.listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.saveWishlist = async (req, res) => {
  const { listingId, action } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    let wishlist = user.wishlist;
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, listings: [] });
      user.wishlist = wishlist._id;
      await wishlist.save();
      await user.save();
    }

    if (action === "add") {
      if (!wishlist.listings.includes(listingId)) {
        wishlist.listings.push(listingId);
      }
    } else if (action === "remove") {
      wishlist.listings = wishlist.listings.filter(
        (id) => id.toString() !== listingId
      );
    }

    await wishlist.save();
    await user.save();

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
