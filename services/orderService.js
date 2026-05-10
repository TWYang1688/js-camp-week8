// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
  const validation = validateOrderUser(userInfo);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  try {
    const data = await createOrder(userInfo);
    return { success: true, data };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
  return await fetchOrders();
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
  const orders = await fetchOrders();
  return orders.filter(order => order.paid === false);
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
  const orders = await fetchOrders();
  return orders.filter(order => order.paid === true);
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  try {
    const data = await updateOrderStatus(orderId, isPaid);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  try {
    const data = await deleteOrder(orderId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
  return {
    id: order.id,
    user: order.user,
    products: order.products,
    total: order.total,
    totalFormatted: formatCurrency(order.total),
    paid: order.paid,
    paidText: order.paid ? '已付款' : '未付款',
    createdAt: formatDate(order.createdAt),
    daysAgo: getDaysAgo(order.createdAt)
  };
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
  console.log('訂單列表：');
  console.log('========================================');

  if (!orders || orders.length === 0) {
    console.log('沒有訂單');
    console.log('========================================');
    return;
  }

  orders.forEach((rawOrder, index) => {
    const order = formatOrder(rawOrder);

    console.log(`訂單 ${index + 1}`);
    console.log('----------------------------------------');
    console.log(`訂單編號：${order.id}`);
    console.log(`顧客姓名：${order.user.name}`);
    console.log(`聯絡電話：${order.user.tel}`);
    console.log(`寄送地址：${order.user.address}`);
    console.log(`付款方式：${order.user.payment}`);
    console.log(`訂單金額：${order.totalFormatted}`);
    console.log(`付款狀態：${order.paidText}`);
    console.log(`建立時間：${order.createdAt} (${order.daysAgo})`);
    console.log('----------------------------------------');
    console.log('商品明細：');
    
    order.products.forEach(productInfo => {
       console.log(`   - ${productInfo.title || productInfo.product?.title} x ${productInfo.quantity}`);
    });
    
    console.log('========================================');
  });
}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders
};
