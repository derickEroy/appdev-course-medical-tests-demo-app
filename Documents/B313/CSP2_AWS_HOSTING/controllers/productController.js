const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Create Product
module.exports.createProduct = (reqBody) => {
	// Builds a product from request body
	let newProduct = new Product({
		name: reqBody.name,
		description: reqBody.description,
		price: reqBody.price,
		productLocation: reqBody.productLocation,
		stock: reqBody.stock
	});

	// Then saves the built product in the database
	return newProduct.save().then((result, error) => {
		if (error){
			return false
		} else {
			return true
		}
	}).catch(err => err);
};

// Retrieve Active
module.exports.retrieveActive = () => {
	// Finds all documents that has isActive as true
	return Product.find({isActive: true}).select('-userOrders').then((result) => {
		return result
	}).catch(err => err);
};

// Retrieve One Product
module.exports.retrieveOne = (reqParams) => {
	return Product.findOne({_id: reqParams}).select('-userOrders').then(result => {
		return result
	}).catch(err => err);
};

// Add Stocks (Admin Only)
module.exports.addStock = async (reqBody) => {
	const { productId, stock } = reqBody;
	const product = await Product.findById(productId);

	if (!product){
		return { message: 'Product not found', status: 404 };
	}

	if (stock <= 0){
		return { message: 'Stock should be at least 1', status: 400 };
	} else {
		product.isActive = true
	}

	return Product.findByIdAndUpdate(productId, { stock }, { new: true }).then(result => result).catch(err => err);
};

// Retrieve All Products (Admin only)
module.exports.retrieveAll = () => {
	// Finds all documents
	return Product.find({}).then((result) => {
		return result
	}).catch(err => err);
};

// Update Product Information (Admin only)
module.exports.updateProduct = (reqBody, reqParams) => {
	return Product.findByIdAndUpdate({_id: reqParams}, reqBody).then((result, error) => {
		if (error){
			return false
		} else {
			return true
		}
	}).catch(err => err);
};

// Archive Product (Admin only)
module.exports.archiveProduct = (reqParams) => {
	return Product.findByIdAndUpdate({_id: reqParams}, {isActive: false}).then((result, error) => {
		if (error){
			return false
		} else {
			return true
		}
	}).catch(err => err);
};

// Activate Product (Admin only)
module.exports.activateProduct = (reqParams) => {
	return Product.findByIdAndUpdate({_id: reqParams}, {isActive: true}).then((result, error) => {
		if (error){
			return false
		} else {
			return true
		}
	}).catch(err => err);
};