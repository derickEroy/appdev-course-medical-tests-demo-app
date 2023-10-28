	// Modules
const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

// Routing Component
const router = express.Router();

// ROUTER: User Registration
router.post('/register', (req, res) => {
	userController.register(req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: User Log-In
router.post("/login", (req, res) => {
	userController.login(req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Add to cart
router.post("/:userId/addToCart", verify, (req, res) => {
	userController.addToCart(req.params.userId, req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Remove from cart
router.put("/:userId/removeFromCart", verify, (req, res) => {
	userController.removeFromCart(req.params.userId, req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Order product
router.post("/:userId/checkout", verify, (req, res) => {
	userController.checkout(req.params.userId).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retrieve User's Orders
router.get("/myOrders", verify, (req, res) => {
	userController.myOrders(req.user.id).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retrive User Details
router.get("/:userId", verify, (req, res) => {
	userController.userDetails(req.user.id).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Set user to Admin (Admin only)
router.put("/userToAdmin", verify, verifyAdmin, (req, res) => {
	userController.userToAdmin(req.body).then(resultFromController => res.send(resultFromController))
});

// ROUTER: Retreive All Orders (Admin only)
router.get("/getAllOrder", verify, verifyAdmin, (req, res) => {
	userController.getAllOrder().then(resultFromController => res.send(resultFromController))
});

module.exports = router;