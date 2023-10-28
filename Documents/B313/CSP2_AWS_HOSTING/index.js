// Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");

// Server
const app = express();
const port = 4000;

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin123@cluster0.ke3gnvk.mongodb.net/E-Commerce_API?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("error", (error) => {
  console.error("Database connection error:", error);
});
db.on("open", () => console.log("Connected to database"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use("/user", user);
app.use("/product", product);

if (require.main === module){
	app.listen(port, () => console.log(`Server is running at port ${port}`));
};

module.exports = app;