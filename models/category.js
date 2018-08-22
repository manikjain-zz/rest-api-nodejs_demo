const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Set schema
const CategorySchema = new Schema({
    name: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product'
    }],
    child_categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }]
});

function autoPopulateChildren(next) {
    this.populate('child_categories');
    next();
}

// Middleware to use autopopulate for sub categories on find or findOne method
CategorySchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren);

// Set model based on schema
const CategoryModel = mongoose.model('category', CategorySchema);

module.exports = CategoryModel;