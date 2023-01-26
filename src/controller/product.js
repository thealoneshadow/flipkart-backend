/** @format */

const shortid = require("shortid");
const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
const generateAIImage = require("./ai.js");

exports.createProduct = async (req, res) => {
	// res.status(200).json({
	// 	file: req.files,
	// 	body: req.body,
	// });

	const {
		name,
		price,
		maximumRetailPrice,
		description,
		category,
		quantity,
		createdBy,
	} = req.body;
	let productPictures = [];
	if (req.files.length > 0) {
		req.files.map((file) => {
			productPictures.push({
				img: file.location,
			});
		});
	}
	const product = new Product({
		name: name,
		slug: slugify(name),
		price,
		maximumRetailPrice,
		quantity,
		description,
		productPictures,
		category,
		createdBy: req.user._id,
	});
	await product.save((err, doc) => {
		if (err) {
			return res.status(400).json({
				status: 500,
				message: err,
			});
		}
		if (doc) {
			return res.status(200).json({
				status: 200,
				message: "Product Created",
				data: doc,
				file: req.files,
			});
		}
	});
};

exports.getProductsBySlug = (req, res) => {
	const { slug } = req.params;
	Category.findOne({ slug: slug })
		.select("_id type")
		.exec((error, category) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (category) {
				Product.find({ category: category._id }).exec((error, products) => {
					if (error) {
						return res.status(400).json({ error });
					}

					if (category.type) {
						if (products.length > 0) {
							res.status(200).json({
								products,
								priceRange: {
									under5k: 5000,
									under10k: 10000,
									under15k: 15000,
									under20k: 20000,
									under30k: 30000,
								},
								productsByPrice: {
									under5k: products.filter((product) => product.price <= 5000),
									under10k: products.filter(
										(product) => product.price > 5000 && product.price <= 10000
									),
									under15k: products.filter(
										(product) => product.price > 10000 && product.price <= 15000
									),
									under20k: products.filter(
										(product) => product.price > 15000 && product.price <= 20000
									),
									under30k: products.filter(
										(product) => product.price > 20000 && product.price <= 30000
									),
								},
							});
						}
					} else {
						res.status(200).json({ products });
					}
				});
			}
		});
};
exports.getProductDetailsById = async (req, res) => {
	const { productId } = req.params;
	if (productId) {
		try {
			const product = await Product.findOne({ _id: productId }).exec();
			res.status(200).json({ product });
		} catch (error) {
			return res.status(400).json({
				status: 500,
				message: error,
			});
		}
	} else {
		return res.status(400).json({
			status: 500,
			message: "Params required",
		});
	}
};

// new update
exports.deleteProductById = (req, res) => {
	const { productId } = req.body.payload;
	if (productId) {
		Product.deleteOne({ _id: productId }).exec((error, result) => {
			if (error) return res.status(400).json({ error });
			if (result) {
				res.status(202).json({ result });
			}
		});
	} else {
		res.status(400).json({ error: "Params required" });
	}
};

exports.getProducts = async (req, res) => {
	const products = await Product.find({ createdBy: req.user._id })
		.select(
			"_id name price maximumRetailPrice quantity slug description productPictures category"
		)
		.populate({ path: "category", select: "_id name" })
		.exec();

	res.status(200).json({ products });
};

exports.getProductDetailsByCategory = async (req, res) => {
	if (req) {
		try {
			const categories = await Category.find({}).exec();
			const products = [];
			for (let i = 0; i < 10; i++) {
				let data = await Product.find({
					category: categories[i]._id,
				})
					.select(
						"_id name price maximumRetailPrice slug productPictures category"
					)
					.populate({ path: "category", select: "_id name" })
					.exec();
				for (let j = 0; j < data.length; j++) {
					products.push(data[j]);
				}
			}
			//for (let i = 0; i < products.length; i++) {
			// const url = await generateAIImage.generateAIImage(
			// 	products[i].name + products[i].description
			// );
			//products[i].description = url;
			//}
			res.status(200).json({ products });
		} catch (error) {
			return res.status(400).json({
				status: 500,
				message: error,
			});
		}
	} else {
		return res.status(400).json({
			status: 500,
			message: "Params required",
		});
	}
};

exports.talktoChatGPT = async (req, res) => {
	if (req.params) {
		try {
			const result = await generateAIImage.chatgpt(req.params.query);
			console.log(result);
			res.status(200).json({ result });
		} catch (error) {
			return res.status(400).json({
				status: 500,
				message: error,
			});
		}
	} else {
		return res.status(400).json({
			status: 500,
			message: "Params required",
		});
	}
};
