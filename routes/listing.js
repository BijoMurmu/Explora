const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,

    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// Search Route
// router.get("/search", wrapAsync(listingController.searchListings));



module.exports = router;



// // Search Route
// router.get(
//   "/search",
//   wrapAsync(async (req, res) => {
//     const query = req.query.query;

//     // If no query is provided, redirect to the listings page or show all listings
//     if (!query) {
//       return res.redirect("/listings");
//     }

//     // Perform the search using a case-insensitive regex query on the `name` and `location` fields
//     const listings = await Listing.find({
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { location: { $regex: query, $options: "i" } },
//       ],
//     });

//     // Render the search results page
//     res.render("listings/search.ejs", { listings, query });
//   })
// );