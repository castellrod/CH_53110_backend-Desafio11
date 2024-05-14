const Router = require('express').Router;
const productRouter=Router()
const ProductController = require('../controller/product.controller');

productRouter.get('/', ProductController.getAllProducts);

productRouter.get('/:id', ProductController.getProductById);

productRouter.post('/', ProductController.createProduct);

productRouter.put('/:id', ProductController.updateProduct);

productRouter.delete('/:id', ProductController.deleteProduct);


module.exports = productRouter;