// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  return await fetchCart();
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const data = await addToCart(productId, quantity);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const data = await updateCartItem(cartId, quantity);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  try {
    const data = await deleteCartItem(cartId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  try {
    const data = await clearCart();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  const cartData = await fetchCart();
  return {
    total: cartData.total || 0,
    finalTotal: cartData.finalTotal || cartData.final_total || 0, // 相容不同命名
    itemCount: cartData.carts ? cartData.carts.length : 0
  };
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  console.log('購物車內容：');
  console.log('----------------------------------------');

  if (!cart || !cart.carts || cart.carts.length === 0) {
    console.log('購物車是空的');
    console.log('----------------------------------------');
    return;
  }

  cart.carts.forEach((item, index) => {
    const price = formatCurrency(item.product.price);
    const subTotal = formatCurrency(item.product.price * item.quantity);
    
    console.log(`${index + 1}. ${item.product.title}`);
    console.log(`   數量：${item.quantity}`);
    console.log(`   單價：${price}`);
    console.log(`   小計：${subTotal}`);
  });

  console.log('----------------------------------------');
  console.log(`商品總計：${formatCurrency(cart.total || 0)}`);
  console.log(`折扣後金額：${formatCurrency(cart.finalTotal || cart.final_total || 0)}`);
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart
};
