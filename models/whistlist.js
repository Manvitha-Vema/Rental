// const { required } = require("joi");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// // const Listing = require("./listing.js");

// const wishlistSchema = mongoose.model(
//   "Wishlist",
//   new Schema({
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     listingId: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Listing",
//         required: true,
//       },
//     ],
//     addedAt: { type: Date, default: Date.now },
//   })
// );

// module.exports = mongoose.model("Wishlist", wishlistSchema);

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  addedAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
