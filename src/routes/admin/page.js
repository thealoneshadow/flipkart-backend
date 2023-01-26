/** @format */

const express = require("express");
const router = express.Router();
const {
	upload,
	requireSignin,
	adminMiddleware,
} = require("../../common-middleware/index.js");
const { createPage, getPage } = require("../../controller/admin/page");

router.post(
	"/page/create",
	upload.fields([{ name: "banners" }, { name: "products" }]),
	requireSignin,
	adminMiddleware,
	createPage
);
router.get(`/page/:category/:type`, getPage);

module.exports = router;
