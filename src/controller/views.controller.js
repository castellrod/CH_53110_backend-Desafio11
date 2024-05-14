const ProductManager = require("../dao/productManager")
const { modeloProductos } = require('../dao/models/productos.modelo'); 
const { modeloCarts } = require('../dao/models/carts.modelo');
const UserManager = require('../dao/userManager');

let userManager = new UserManager();

const productManager = new ProductManager()

class ViewsController{
    
    // GET HOME
    static async getHome(req, res) {
        res.status(200).render('home');
    }

    // GET PRODUCTS
    static async getProducts(req, res) {
        let { pagina } = req.query;
        if (!pagina) {
            pagina = 1;
        }

        let {
            docs: products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await modeloProductos.paginate({}, { limit: 2, page: pagina, lean: true });

        let welcomeMessage = "";
        if (req.session.user) {
            try {
                const user = await userManager.getUserByFilter({ username: req.session.user.username });
                if (user.role === 'admin') {
                    welcomeMessage = `Bienvenido, ${user.username}. Eres un administrador.`;
                } else {
                    welcomeMessage = `Bienvenido, ${user.username}.`;
                }
            } catch (error) {
                console.error('Error al obtener información del usuario:', error);
            }
        }

        res.status(200).render('products', {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            welcomeMessage
        });
    }

    // GET PRODUCT BY ID
    static async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await modeloProductos.findById(productId).lean();
            if (!product) {
                return res.status(404).send('El producto no fue encontrado.');
            }
            res.render('singleproduct', { product });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al procesar la solicitud.');
        }
    }

    // GET CART BY ID
    static async getCartById(req, res) {
        try {
            const cartId = req.params.id;
            const cart = await modeloCarts.findById(cartId).populate('products').lean();
            if (!cart) {
                return res.status(404).send('El carrito no fue encontrado.');
            }
      
            // Obtener los detalles de los productos basados en sus productId
            const productsWithDetails = await Promise.all(cart.products.map(async product => {
                const productDetails = await modeloProductos.findById(product.productId).lean();
                return {
                    ...product,
                    title: productDetails.title,
                    price: productDetails.price
                };
            }));
      
            res.render('cart', { cart: { ...cart, products: productsWithDetails } });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al procesar la solicitud.');
        }
    }

    // LOGIN VIEW
    static async getLogin(req, res) {
        let {message, error} = req.query;
        res.status(200).render('login', {message, error});
    }

    // REGISTER VIEW
    static async getRegister(req, res) {
        let {message, error} = req.query;
        res.status(200).render('register', {message, error});
    }

    // PROFILE PAGE VIEW

    static async getProfile(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('profile', { user: req.session.user });
    }

    // REALTIME PRODUCTS VIEW

    static async getRealtimeProducts(req, res) {
        const products = await productManager.getProducts();
        res.status(200).render('realtimeproducts', { products });
    }
}

module.exports = ViewsController;