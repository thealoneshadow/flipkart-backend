/** @format */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require("dotenv");
//rout4es
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const path = require("path");
const cors = require("cors");
const adminOrderRoute = require("./routes/admin/order.routes");
//environment variables
env.config();
// mongodb+srv://AamioElectric:6397984019Jio@aamio.vtz6m.mongodb.net/?retryWrites=true&w=majority
mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.ghx4xia.mongodb.net/beckend-ecommerce?retryWrites=true&w=majority`
	)
	.then(() => {});
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);
app.listen(process.env.PORT, () => {
	console.log(process.env.PORT);
});
