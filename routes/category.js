const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/category');
const { validate_body, schemas}  = require('../validators/validators');

// Route to get categories
router.get('/', category_controller.index);

// Route to add categories
router.route('/add')
    .post(validate_body(schemas.addCategorySchema), category_controller.addCategory);

module.exports = router;