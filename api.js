// ========================================
// API 請求函式
// ========================================

const axios = require('axios');
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require('./config');

// ========== 客戶端 API ==========

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
    return response.data.products;
  } catch (error) {
    console.error('取得產品列表失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
  try {
    const response = await axios.get(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
    return response.data;
  } catch (error) {
    console.error('取得購物車失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
  try {
    const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
      data: {
        productId,
        quantity
      }
    });
    return response.data;
  } catch (error) {
    console.error('加入購物車失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
  try {
    const response = await axios.patch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
      data: {
        id: cartId,
        quantity
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新購物車商品數量失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function deleteCartItem(cartId) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('刪除購物車商品失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function clearCart() {
  try {
    const response = await axios.delete(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
    return response.data;
  } catch (error) {
    console.error('清空購物車失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function createOrder(userInfo) {
  try {
    const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/orders`, {
      data: {
        user: userInfo
      }
    });
    return response.data;
  } catch (error) {
    console.error('建立訂單失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

// ========== 管理員 API ==========

const adminHeaders = {
  headers: {
    authorization: ADMIN_TOKEN
  }
};

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
  try {
    const response = await axios.get(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`, adminHeaders);
    return response.data.orders;
  } catch (error) {
    console.error('取得訂單列表失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updateOrderStatus(orderId, isPaid) {
  try {
    const response = await axios.put(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`, {
      data: {
        id: orderId,
        paid: isPaid
      }
    }, adminHeaders);
    return response.data;
  } catch (error) {
    console.error('更新訂單狀態失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function deleteOrder(orderId) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders/${orderId}`, adminHeaders);
    return response.data;
  } catch (error) {
    console.error('刪除訂單失敗:', error.response?.data?.message || error.message);
    throw error;
  }
}

module.exports = {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder
};
