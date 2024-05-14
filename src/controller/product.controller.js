const ProductManager = require("../dao/productManager")
const { modeloProductos } = require('../dao/models/productos.modelo'); 

const productManager = new ProductManager()

class ProductController{
    static async getAllProducts(req, res) {
        try {
            const { page = 1, limit = 2 } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            };
            const products = await modeloProductos.paginate({}, options);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductById(req, res) {
        const productId = req.params.id;
        try {
            const product = await productManager.getProductById(productId);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }

    static async createProduct(req, res) {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        try {
            const newProduct = await productManager.addProduct(
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category
            );
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        const productId = req.params.id;
        const updatedFields = req.body;

        try {
            const updatedProduct = await productManager.updateProduct(productId, updatedFields);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async deleteProduct(req, res) {
        const productId = req.params.id;
        try {
            await productManager.deleteProduct(productId);
            res.json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;