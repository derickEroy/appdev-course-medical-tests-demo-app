const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "First name in User model is required"]
	},
	lastName: {
		type: String,
		required: [true, "Last name in User model is required"]
	},
	address: {
		street: {
			type: String,
			required: [true, "Street in User model is required"]
		},
		city: {
			type: String,
			required: [true, "City in User model is required"]
		},
		state: {
			type: String,
			required: [true, "State in User model is required"]
		},
		postalCode: {
			type: String,
			required: [true, "Postal code in User model is required"]
		},
		country: {
			type: String,
			required: [true, "Country in User model is required"]
		}
	},
	email: {
		type: String,
		required: [true, "Email in User model is required"]
	},
	mobileNo: {
		type: String,
		required: [true, "Mobile number in User model is required"]
	},
	password: {
		type: String,
		required: [true, "Password in User model is required"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	orderedProduct: [
		{
			products: [
				{
					productId: {
						type: String,
						required: [true, "Product ID in User model is required"]
					},
					productName: {
						type: String,
						required: [true, "Product name in User model is required"]
					},
					quantity: {
						type: Number,
						required: [true, "Quantity in User model is required"]
					},
					subTotal: {
						type: Number,
						required: [true, "Quantity in User model is required"]
					}
				}
			],
			totalAmount: {
				type: Number,
				required: [true, "Quantity in User model is required"]
			},
			purchasedOn: {
				type: Date,
				default: new Date()
			},
		}
	],
	cart: {
		products: [
			{
				productId: {
					type: String,
					required: [true, "Product ID in User model is required"]
				},
				productName: {
					type: String,
					required: [true, "Product name in User model is required"]
				},
				quantity: {
					type: Number,
					required: [true, "Quantity in User model is required"]
				},
				subTotal: {
					type: Number,
					required: [true, "Subtotal in User model is required"]
				}
			}
		],
		cartTotal: {
			type: Number,
			default: 0,
			required: [true, "Cart total in User model is required"]
		}
	}
});

module.exports = mongoose.model("User", userSchema);