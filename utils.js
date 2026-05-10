// ========================================
// 工具函式
// ========================================

const dayjs = require('dayjs');

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
  if (product.price === product.origin_price) return '無折扣';
  
  const rate = (product.price / product.origin_price) * 10;
  
  // 依據測試要求進行四捨五入至整數（例如：7.4 折 -> 7 折）
  const formattedRate = Math.round(rate);
  
  return `${formattedRate}折`;
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
  const categories = products.map(item => item.category);
  return [...new Set(categories)];
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {
  // API 常常回傳 10 碼或 13 碼，若為 10 碼請用 dayjs.unix()
  const isUnix = timestamp.toString().length === 10;
  const date = isUnix ? dayjs.unix(timestamp) : dayjs(timestamp);
  return date.format('YYYY/MM/DD HH:mm');
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
  const isUnix = timestamp.toString().length === 10;
  const targetDate = isUnix ? dayjs.unix(timestamp) : dayjs(timestamp);
  const diffDays = dayjs().diff(targetDate, 'day');
  
  if (diffDays === 0) return '今天';
  return `${diffDays} 天前`;
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 * 
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  const errors = [];
  const phoneRegex = /^09\d{8}$/;

  if (!data.name || data.name.trim() === '') errors.push('姓名不可為空');
  if (!phoneRegex.test(data.tel)) errors.push('電話必須是 09 開頭的 10 位數字');
  if (!data.email || !data.email.includes('@')) errors.push('Email 必須包含 @ 符號');
  if (!data.address || data.address.trim() === '') errors.push('地址不可為空');
  
  const validPayments = ['ATM', 'Credit Card', 'Apple Pay'];
  if (!validPayments.includes(data.payment)) errors.push('付款方式無效');

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 * 
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  if (!Number.isInteger(quantity)) return { isValid: false, error: '必須是整數' };
  if (quantity < 1) return { isValid: false, error: '數量不可小於 1' };
  if (quantity > 99) return { isValid: false, error: '數量不可大於 99' };
  
  return { isValid: true };
}
/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 * 
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 * 
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 * 
 */
function formatCurrency(amount) {
  return `NT$ ${amount.toLocaleString('zh-TW')}`;
}

module.exports = {
  getDiscountRate,
  getAllCategories,
  formatDate,
  getDaysAgo,
  validateOrderUser,
  validateCartQuantity,
  formatCurrency
};
