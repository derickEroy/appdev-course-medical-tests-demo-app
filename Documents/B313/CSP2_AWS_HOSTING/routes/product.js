// Modules
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

// Routing Component
const router = express.Router();

// ROUTER: Create a product
router.post("/", verify, verifyAdmin, (req, res) => {
	productController.createProduct(req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retrieve all active product
router.get("/activeProducts", (req, res) => {
	productController.retrieveActive().then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retrieve Single Product
router.get("/:productId", (req, res) => {
	productController.retrieveOne(req.params.productId).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Add stocks (Admin only)
router.put("/addStock", verify, verifyAdmin, (req, res) => {
	productController.addStock(req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retrieve all products (Admin only)
router.get("/all", verify, verifyAdmin, (req, res) => {
	productController.retrieveAll().then(resultFromController => res.send(resultFromController))
});

// ROUTER: Update Product Information (Admin only)
router.put("/:productId/update", verify, verifyAdmin, (req, res) => {
	productController.updateProduct(req.body, req.params.productId).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Archive Product (Admin only)
router.put("/:productId/archive", verify, verifyAdmin, (req, res) => {
	productController.archiveProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Activate Product (Admin only)
router.put("/:productId/activate", verify, verifyAdmin, (req, res) => {
	productController.activateProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
});

module.exports = router;