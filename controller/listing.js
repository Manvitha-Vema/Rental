const Listing = require("../models/listing");

// module.exports.search = async (req, res) => {
//   const value = req.query.search;
//   console.log(value);

//   const allListings = await Listing.find({
//     $or: [
//       { title: { $regex: value, $options: "i" } },
//       { country: { $regex: value, $options: "i" } },
//       { location: { $regex: value, $options: "i" } },
//     ],
//   });

//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.index = async (req, res) => {
//   const category = req.query.category;
//   const search = req.query.search;

//   if (search) {
//     const allListings = await Listing.find({
//       $or: [
//         { title: { $regex: search, $options: "i" } },
//         { country: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//       ],
//     });
//     if (allListings.length === 0) {
//       return res.render("listings/nofound.ejs");
//     }
//     return res.render("listings/index.ejs", { allListings, user: req.user });
//   }
//   try {
//     if (!category) {
//       const allListings = await Listing.find({});
//       return res.render("listings/index.ejs", { allListings, user: req.user });
//     }
//   } catch (error) {
//     res.status(500).send("An error occurred");
//   }
//   const allListings = await Listing.find({ category: category });
//   res.render("listings/index.ejs", { allListings, user: req.user });
// };

module.exports.index = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const allListings = await Listing.find(query);

    if (allListings.length === 0) {
      return res.render("listings/nofound.ejs");
    }

    res.render("listings/index.ejs", { allListings, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching listings");
  }
};

// module.exports.addWishlist = async (req, res) => {
//   const { userId } = req.user;
//   const { listingId } = req.body;
//   try {
//     const user = User.findById(userId);
//     const alreadyadded = user.wishlist.find(
//       (id) => id.toString() === listingId
//     );
//     if (alreadyadded) {
//       let user = await User.findByIdAndUpdate(
//         userId,
//         {
//           $pull: { wishlist: listingId },
//         },
//         {
//           new: true,
//         }
//       );
//       res.send(user);
//     } else {
//       let user = await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: { wishlist: listingId },
//         },
//         {
//           new: true,
//         }
//       );
//       res.send(user);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// };

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you have requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you have requested for does not exist!");
    res.redirect("/listings");
  }
  let original_image = listing.image.url;
  // original_image = original_image.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, original_image });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
