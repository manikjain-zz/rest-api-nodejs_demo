const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product');
const { validate_body, schemas}  = require('../validators/validators');

// Route to get product by category
router.get('/', product_controller.index);

// Route to add product by category or categories
router.route('/add')
    .post(validate_body(schemas.addProductSchema), product_controller.addProductByCategory);

// Route to update product details
router.route('/update')
    .put(validate_body(schemas.updateProductSchema), product_controller.updateProduct);

module.exports = router;