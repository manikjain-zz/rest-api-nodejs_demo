# rest-api-nodejs_demo

This project demonstrates RESTful API in Node.js using Express and MongoDB.

## MongoDB data model

The MongoDB data model used here has the following design:

There are two entities used: 'Categories' and 'Products'

A category can have multiple child categories. A child category can have further child categories. A category can have multiple products and a product can have a multiple categories.

## API Endpoints

1. Add a category, use: POST localhost:4322/api/category/add.
1. Add Product mapped to a category or categories, use: POST localhost:4322/api/product/add.
1. Get all categories with all its child categories mapped to it, use: GET localhost:4322/api/category.
1. Get all products by a category, use: GET localhost:4322/api/product?category='Category Name'
1. Update product details (name,price,etc), use: PUT localhost:4322/api/product/update.

### POSTMAN Collection

The repo consists of a postman collection which may be used to quickly get an idea about how the API endpoints work. The collection mimics the following workflow:

![rest api test workflow](https://user-images.githubusercontent.com/21245503/44470951-8ab87280-a648-11e8-8c85-9ef2e6f2133b.jpeg)
