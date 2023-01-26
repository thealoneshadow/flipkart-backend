/** @format */

const express = require("express");
const {
	validateSignupRequest,
	validateSigninRequest,
	isRequestValidated,
} = require("../../validators/auth");
const { singup, signin, signout } = require("../../controller/admin/auth");
const router = express.Router();
const { requireSignin } = require("../../common-middleware/index.js");

router.post("/admin/signup", validateSignupRequest, isRequestValidated, singup);

router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/admin/signout", signout);

module.exports = router;
