const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Register User
module.exports.register = (reqBody) => {
	// Creates a newUser variable to store input from request body
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		address: reqBody.address,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		// Password from request body will be hashed
		password: bcrypt.hashSync(reqBody.password, 10)
	})

	// Then the new user variable will be saved in the database
	return newUser.save().then((user, err) => {
		if(err){
			return false
		} else {
			return true
		}
	}).catch(err => err)
};

// Login User
module.exports.login = (reqBody) => {
	// findOne() searches its match from request body and database.
	// Then, the document will be called result (or document)
	return User.findOne({email: reqBody.email}).then((result) => {
		// Checks if result has found a document that matches email or not
		if(result == null){
			return false
		} else {
			// If found, verify using bcrypt.compareSync() for both request password and database's hashed password
			let passwordVerify = bcrypt.compareSync(reqBody.password, result.password);

			// If verification is approved, create an access token from auth.js using the document as reference
			if(passwordVerify){
				return {
					access: auth.createAccessToken(result)
				}
			} else {
				return false
			}
		}
	}).catch(err => err)
};

// Add to Cart
module.exports.addToCart = async (reqParams, reqBody) => {
	try {
		// Finds user document using request params ID
		// Finds product document using request body product ID
		const user = await User.findById(reqParams);
		const product = await Product.findById(reqBody.productId);

		if (!user) {
            return { error: 'User not found', status: 404};
        }

        if (!product) {
            return { error: 'Product not found', status: 404};
        }

        if (reqBody.quantity > product.stock){
        	return { error: `Only ${product.stock} left in stock`}
        };

        // Assigns the product price multiplied by quantity into subTotal
		const subTotal = product.price * reqBody.quantity;

		// If the same item is already in cart and you want to addToCart again, instead of creating another object it will just add the request body's quantity and subTotal into the cart item's quantity and subTotal
		if (user.cart.products.some(product => product.productId === reqBody.productId)){
			// Obj is the product object in the cart.products that has the same productId in the request body
			const obj = user.cart.products.find(product => product.productId === reqBody.productId);

			if (product.isActive === false){
				return { message: 'Product is not available', status: 400}
			} else if (product.stock === 0){
				return { message: 'Product is out of stock', status: 400}
			} else {
				obj.quantity += reqBody.quantity;
				obj.subTotal += subTotal;
			}
		} else {
			
			if (product.isActive === false){
				return { message: 'Product is not available', status: 400}
			} else if (product.stock === 0){
				return { message: 'Product is out of stock', status: 400}
			} else {
				user.cart.products.push(
					{
						productId: product._id,
						productName: product.name,
						quantity: reqBody.quantity,
						subTotal: subTotal
					}
				);
			}
		}

		// Reassigns cartTotal from user document by adding its previous value to subTotal
		user.cart.cartTotal += subTotal;

		await user.save();

		return { message: 'Product added to cart successfully' };
	} catch (error) {
		console.error(error);
		return { error: 'Internal server error', status: 500};
	}
};

// Remove from Cart
module.exports.removeFromCart = async (reqParams, reqBody) => {
	try {
		// Finds user document using request params ID
		// Finds product document using request body product ID
		const user = await User.findById(reqParams);
		const product = await Product.findById(reqBody.productId);

		if (!user) {
            return { error: 'User not found', status: 404};
        }

        if (!product) {
            return { error: 'Product not found', status: 404};
        }

		// Find the object of the product in the user's cart
		const obj = await user.cart.products.find(product => product.productId === reqBody.productId);

		if (!obj) {
            return { error: 'Product not found in the cart', status: 404};;
        }

		/*
			Checks if the quantity of the object reached 0.
			If it did, it will remove that object from the array.
			If it did not, it will just deduct quantity and subTotal
		*/

		if (obj.quantity - reqBody.quantity > 0){
			obj.quantity -= reqBody.quantity;
			obj.subTotal -= product.price * reqBody.quantity;
		} else if (obj.quantity - reqBody.quantity < 0){
			return { error: 'The quantity your trying to remove exceeds what remains in the cart', status: 400};
		} else {
			user.cart.products = await user.cart.products.filter(product => product.productId !== reqBody.productId)
		}

		// Reassigns cartTotal from user document by deducting product price multiplied by quantity
		user.cart.cartTotal -= product.price * reqBody.quantity;

		await user.save();

		return { message: 'Product removed from cart successfully' };
	} catch (error) {
		console.error(error);
		return { error: 'Internal server error', status: 500};
	}
};

// Order Product
module.exports.checkout = async (reqParams) => {
	try {
		const user = await User.findById(reqParams);

		if (!user){
			return { error: 'User is not found', status: 404 };
		};

		if(user.cart.products.length === 0){
			return { error: 'Cannot place an order. Cart is empty.', status: 400 };
		};

		const productsFromCart = user.cart.products.map(item => {
			return {
				productId: item.productId,
				productName: item.productName,
				quantity: item.quantity,
				subTotal: item.subTotal
			};
		});

		const order = {
			products: productsFromCart,
			totalAmount: user.cart.cartTotal,
			purchasedOn: new Date()
		};

		user.orderedProduct.push(order);

		for (const item of productsFromCart) {
		    const product = await Product.findById(item.productId);

		    const productOrder = {
		    	userId: reqParams,
		    	orderId: user.orderedProduct[user.orderedProduct.length - 1]._id,
		    	products: user.cart.products
		    }

		    if (product) {
		        product.userOrders.push(productOrder);
		        await product.save();
		    }
		}

		user.cart.products.forEach(async item => {
			const productDocument = await Product.findById(item.productId);

			productDocument.stock -= item.quantity;

			if (productDocument.stock === 0){
				productDocument.isActive = false
			};

			await productDocument.save();
		});
		user.cart.cartTotal = 0;
		user.cart.products = [];

		await user.save();

		return { message: "Product is on it's way!", orderDetails: order };

	} catch (error){
		console.error(error);
		return { error: 'Internal server error', status: 500 };
	}
};

// Retrieve User Details
module.exports.userDetails = (reqParams) => {
	return User.findById(reqParams).then(result => result).catch(err => err);
};

// Retrieve User Order
module.exports.myOrders = (userId) => {
	return User.findById(userId).select('orderedProduct').then(result => result).catch(err => err);
};

// User to Admin (Admin only)
module.exports.userToAdmin = (reqBody) => {
	// Searches for a document with the ID on request body and change isAdmin to true.
	return User.findByIdAndUpdate(reqBody.id, {isAdmin: true}).then((result, error) => {
		if(error){
			return false
		} else {
			return true
		}
	}).catch(err => err);
};

// Retrieve All Orders (Admin only)
module.exports.getAllOrder = (reqBody) => {
	return User.find({}).select('firstName lastName orderedProduct').then(result => result).catch(err => err);
};