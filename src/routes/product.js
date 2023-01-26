/** @format */

const express = require("express");
const {
	requireSignin,
	adminMiddleware,
} = require("../common-middleware/index.js");
const router = express.Router();
const Product = require("../models/product.js");
const {
	createProduct,
	getProductsBySlug,
	getProductDetailsById,
	deleteProductById,
	getProducts,
	getProductDetailsByCategory,
	talktoChatGPT,
} = require("../controller/product.js");
const { upload, uploadS3 } = require("../common-middleware/index.js");
// const multer = require("multer");
// const shortid = require("shortid");
// const path = require("path");

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, path.join(path.dirname(__dirname), "uploads"));
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, shortid.generate() + "-" + file.originalname);
// 	},
// });

// const upload = multer({ storage });

router.post(
	"/product/create",
	requireSignin,
	adminMiddleware,
	uploadS3.array("productPicture"),
	createProduct
);

router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.get("/allproducts", getProductDetailsByCategory);
router.delete(
	"/product/deleteProductById",
	requireSignin,
	adminMiddleware,
	deleteProductById
);
router.post(
	"/product/getProducts",
	requireSignin,
	adminMiddleware,
	getProducts
);

router.post("/talktoAIChatBox/:query", talktoChatGPT);

module.exports = router;
