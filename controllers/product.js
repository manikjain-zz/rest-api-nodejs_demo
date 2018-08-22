const mongoose = require('mongoose');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');

module.exports = {
    index: async (req, res, next) => {
        // Find all products mapped to a specified category
        try {
            if (!req.query.category) res.status(400).json({ message: `No category specified` });
            const category = await CategoryModel.findOne({ name: req.query.category });
            if (!category) res.status(200).json({ message: `Category '${req.query.category}' could not be found` });
            const products = await ProductModel.find({ categories: mongoose.Types.ObjectId(category.id) });
            if (products.length < 1) res.status(200).json({ message: `No products could be found for '${req.query.category}'` });
            res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    },

    addProductByCategory: async (req, res, next) => {
        try {
            let product;
            // Check if the body has just the name or both the price & name specified
            if (!req.body.price) {
                product = new ProductModel({ name: req.body.name });
            } else {
                product = new ProductModel({ name: req.body.name, price: req.body.price });
            }
            let successfulCategories = {};
            let failedCategories = {};
            // Loop over categories specified to check their validity and then store them separately for processing
            for (var i = 0; i < req.body.categories.length; i++) {
                const findCategory = await CategoryModel.findOne({ name: req.body.categories[i] });
                if (findCategory) {
                    findCategory.products.push(product);
                    successfulCategories[req.body.categories[i]] = findCategory;
                    product.categories.push(findCategory);
                } else {
                    failedCategories[req.body.categories[i]] = findCategory;
                }
            };
            // check if some of the categories were found to be existing and then save them with product data
            if (Object.keys(successfulCategories).length > 0) {
                for (var key in successfulCategories) {
                    if (successfulCategories.hasOwnProperty(key)) {
                        await successfulCategories[key].save();
                    }
                }
            }
            // Respond based on whether categories were found or not found or found partially
            if (Object.keys(failedCategories).length === 0) {
                const savedProduct = await product.save();
                res.status(200).json({
                    message: `Created a new product '${req.body.name}' with categories: ${Object.keys(successfulCategories)}`,
                    product: savedProduct
                });
            } else if ((Object.keys(failedCategories).length > 0) && (Object.keys(successfulCategories).length > 0)) {
                const savedProduct = await product.save();
                res.status(200).json({
                    message: `Created a new product '${req.body.name}' with categories: ${Object.keys(successfulCategories)}. Categories not found: ${Object.keys(failedCategories)}`,
                    product: savedProduct
                });
            } else if ((Object.keys(successfulCategories).length === 0) && (Object.keys(failedCategories).length > 0)) {
                res.status(200).json({
                    message: `None of the categories specified could be found.`
                });
            }
        } catch (err) {
            next(err);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            // Check if existing product's name is specified in the body
            const findProduct = await ProductModel.findOne({ name: req.body.productName });
            // check if product exists
            if (!findProduct) {
                res.status(200).json({
                    message: `The product '${req.body.productName}' could not be found.`
                });
            }
            // Update based on which body fields are specified - name, price or categories
            if (req.body.name) findProduct.name = req.body.name;
            if (req.body.price) findProduct.price = req.body.price;
            if (req.body.categories) {
                let successfulCategories = {};
                let failedCategories = {};
                // Loop over categories specified to check their validity and then store them separately for processing
                for (var i = 0; i < req.body.categories.length; i++) {
                    const findCategory = await CategoryModel.findOne({ name: req.body.categories[i] });
                    if (findCategory) {
                        findCategory.products.push(findProduct);
                        successfulCategories[req.body.categories[i]] = findCategory;
                        findProduct.categories.push(findCategory);
                    } else {
                        failedCategories[req.body.categories[i]] = findCategory;
                    }
                };
                // check if some of the categories were found to be existing and then save them with product data
                if (Object.keys(successfulCategories).length > 0) {
                    for (var key in successfulCategories) {
                        if (successfulCategories.hasOwnProperty(key)) {
                            await successfulCategories[key].save();
                        }
                    }
                }
                // Respond based on whether categories were found or not found or found partially
                if (Object.keys(failedCategories).length === 0) {
                    const savedProduct = await findProduct.save();
                    res.status(200).json({
                        message: `Updated product '${req.body.productName}' with categories: ${Object.keys(successfulCategories)}`,
                        product: savedProduct
                    });
                } else if ((Object.keys(failedCategories).length > 0) && (Object.keys(successfulCategories).length > 0)) {
                    const savedProduct = await findProduct.save();
                    res.status(200).json({
                        message: `Updated product '${req.body.productName}' with categories: ${Object.keys(successfulCategories)}. Categories not found: ${Object.keys(failedCategories)}`,
                        product: savedProduct
                    });
                } else if ((Object.keys(successfulCategories).length === 0) && (Object.keys(failedCategories).length > 0)) {
                    res.status(200).json({
                        message: `None of the categories specified could be found.`
                    });
                }
            }
            const savedProduct = await findProduct.save();
            res.status(200).json({
                message: `Updated product '${req.body.name}'`,
                product: savedProduct
            });
        } catch (err) {
            next(err);
        }
    }
}