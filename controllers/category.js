const mongoose = require('mongoose');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');

function handleError (req, res, err) {
    const errMsg = err.message || 'An error occured';
    res.status((err.status) || 500).send({
        message: errMsg
    });
}

module.exports = {
    index: async (req, res, next) => {
        // To find all categories and populate the child categories to the maximum depth
        try {
            let category = await CategoryModel.find({});
            res.status(200).json(category);            
        } catch(err) {
            handleError(req, res, err);
        }        
    },

    addCategory: async (req, res, next) => {
        try {
            /* Check whether both parent and child exist in the body or not */
            if (req.body.child && req.body.parent) {
                let checkParentCategory = await CategoryModel.findOne({ name: req.body.parent });
                let checkChildCategory = await CategoryModel.findOne({ name: req.body.child });
                // conditions if both parent and child categories exist - we will have to create new documents for both parent and child and link them together
                if (!checkParentCategory && !checkChildCategory) {
                    const parentCategory = new CategoryModel({ name: req.body.parent });
                    const childCategory = new CategoryModel({ name: req.body.child });
                    await childCategory.save();
                    parentCategory.child_categories.push(childCategory);
                    const newCategory = await parentCategory.save();
                    res.status(200).json({
                        message: `Created new parent: ${req.body.parent} & new child: ${req.body.child}`,
                        parent: newCategory
                    });
                }
                // condition if the parent category already exists and new child category has to be created
                else if (checkParentCategory && !checkChildCategory) {
                    const childCategory = new CategoryModel({ name: req.body.child });
                    await childCategory.save();
                    checkParentCategory.child_categories.push(childCategory);
                    const modifiedCategory = await checkParentCategory.save();
                    res.status(200).json({
                        message: `Added to existing parent: ${req.body.parent} & create new child: ${req.body.child}`,
                        parent: modifiedCategory
                    });
                } 
                // condition if the parent category specified doesn't exist, but the child category exists - an invalid format
                else if (!checkParentCategory && checkChildCategory) {
                    res.status(200).json({ message: `Parent category ${req.body.parent} doesn\'t exist` });
                } 
                // condition if both the parent and child categories specified exist - nothing to do here
                else if (checkParentCategory && checkChildCategory) {
                    res.status(200).json({ message: `Both parent: ${req.body.parent} and child: ${req.body.child} categories already exist.` });
                }
            } 
            /* Check if parent exists in the body but child is missing */
            else if (req.body.parent && !req.body.child) {
                let checkParentCategory = await CategoryModel.findOne({ name: req.body.parent });
                // condition if parent category already exists or not
                if (checkParentCategory) {
                    res.status(200).json({ message: `Parent category: ${req.body.parent}  already exists` });
                } else {
                    const parentCategory = new CategoryModel({ name: req.body.parent });
                    const newCategory = await parentCategory.save();
                    res.status(200).json({
                        message: `Created new parent: ${req.body.parent}`,
                        parent: newCategory
                    });
                }
            }
        } catch(err) {
            handleError(req, res, err);
        }
    }
}
