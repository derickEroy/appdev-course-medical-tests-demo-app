const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"]
	},
	description: {
		type: String,
		required: [true, "Description is required"]
	},
	price: {
		type: Number,
		required: [true, "Price is required"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},	
	userOrders: [
		{
			userId: {
				type: String,
				required: [true, "User ID is required"]
			},
			orderId: {
				type: String,
				required: [true, "Order ID is required"]
			},
			products: [
				{
					productId: {
						type: String,
						required: [true, "Product ID is required"]
					},
					productName: {
						type: String,
						required: [true, "Product name is required"]
					},
					quantity: {
						type: Number,
						required: [true, "Quantity is required"]
					},
					subTotal: {
						type: Number,
						required: [true, "Quantity is required"]
					}
				}
			]
		}
	],
	stock: {
		type: Number,
		required: [true, "Stock is required"]
	}
});

module.exports = mongoose.model("Product", productSchema);