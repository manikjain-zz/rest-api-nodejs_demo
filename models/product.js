const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Set schema
const ProductSchema = new Schema({
    name: String,
    price: Number,
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }]
});

// Set model based on schema
const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;