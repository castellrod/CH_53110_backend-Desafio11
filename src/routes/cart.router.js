const Router = require('express').Router;
//const CartManager = require("../managers/cartManager") 
const cartRouter=Router()
const { modeloCarts } = require('../dao/models/carts.modelo');


const cartManager = new CartManager();


cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


cartRouter.post('/', async (req, res) => {
    const initialProducts = req.body.products || []; 
    try {
        const newCart = await cartManager.createCart(initialProducts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


cartRouter.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await modeloCarts.findById(cartId).populate({
            path: 'products.productId',
            select: 'title price description code category stock status'
        });
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' + error.message });
    }
});


cartRouter.post('/:id/products', async (req, res) => {
    const cartId = req.params.id;
    const productId = req.body.productId; 
    try {
        const addedProduct = await cartManager.addProductToCart(cartId, productId);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


cartRouter.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito: ' + error.message });
    }
});

cartRouter.put('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json({ message: 'Cantidad del producto actualizada exitosamente en el carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito: ' + error.message });
    }
});

cartRouter.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        await cartManager.removeAllProductsFromCart(cartId);
        res.json({ message: 'Todos los productos han sido eliminados del carrito exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito: ' + error.message });
    }
});



module.exports = cartRouter;