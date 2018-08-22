const Joi = require('joi');

module.exports = {
    // method for validating the body
    validate_body: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                req['body'] = result.value;
                next();
            }
        }
    },
    schemas : {
        // to validate body while adding a product
        addProductSchema: Joi.object().keys({
            name: Joi.string().required().min(1),
            price: Joi.number().optional(),
            categories: Joi.array().required().min(1)
        }),
        // to validate body while updating a product
        updateProductSchema: Joi.object().keys({
            productName: Joi.string().required().min(1),
            name: Joi.string().optional().min(1),
            price: Joi.number().optional(),
            categories: Joi.array().optional().min(1)
        }),
        // to validate body while adding a category
        addCategorySchema: Joi.object().keys({
            parent: Joi.string().required().min(1),
            child: Joi.string().optional().min(1)
        })
    }
}