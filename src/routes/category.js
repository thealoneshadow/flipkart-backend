/** @format */

const express = require("express");
const {
	requireSignin,
	adminMiddleware,
} = require("../common-middleware/index.js");
const router = express.Router();
const {
	addCategory,
	getCategories,
	updateCatgories,
	deleteCategories,
} = require("../controller/category");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const { uploadS3 } = require("../common-middleware/index.js");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(path.dirname(__dirname), "uploads"));
	},
	filename: function (req, file, cb) {
		cb(null, shortid.generate() + "-" + file.originalname);
	},
});

router.post(
	"/category/create",
	requireSignin,
	adminMiddleware,
	uploadS3.single("categoryImage"),
	addCategory
);
router.get("/category/getCategory", getCategories);
router.post(
	"/category/update",
	requireSignin,
	adminMiddleware,
	uploadS3.array("categoryImage"),
	updateCatgories
);
router.post("/category/delete", deleteCategories);

module.exports = router;
