import Cart from '../models/cart.model.js';

// Helper: extract user ID from JWT payload ({ user: { id, isAdmin } })
const getUserId = (req) => req.user?.user?.id;

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: getUserId(req) });
    if (cart) {
      res.json(cart);
    } else {
      res.json({ cartItems: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { product, name, quantity, image, price, variant } = req.body;
  const userId = getUserId(req);

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if product exists in cart
      const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === product && (!p.variant || p.variant.sku === variant?.sku));

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        let productItem = cart.cartItems[itemIndex];
        productItem.quantity += quantity;
        cart.cartItems[itemIndex] = productItem;
      } else {
        // Product does not exist in cart, add new item
        cart.cartItems.push({ product, name, quantity, image, price, variant });
      }
      cart = await cart.save();
      res.json(cart);
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        user: userId,
        cartItems: [{ product, name, quantity, image, price, variant }]
      });
      res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  const productId = req.params.id;
  const variantSku = req.query.sku;

  try {
    let cart = await Cart.findOne({ user: getUserId(req) });

    if (cart) {
      cart.cartItems = cart.cartItems.filter(item =>
        !(item.product.toString() === productId && (!variantSku || item.variant?.sku === variantSku))
      );
      cart = await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: getUserId(req) });
    if (cart) {
      cart.cartItems = [];
      await cart.save();
      res.json({ message: 'Cart cleared' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
