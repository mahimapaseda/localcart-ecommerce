/**
 * Format price in Sri Lankan Rupees (LKR)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount) => {
    if (amount === null || amount === undefined) return 'Rs. 0.00';
    return `Rs. ${Number(amount).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/**
 * Format price without decimals for compact display
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string
 */
export const formatPriceCompact = (amount) => {
    if (amount === null || amount === undefined) return 'Rs. 0';
    return `Rs. ${Number(amount).toLocaleString('en-LK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
};

/**
 * Currency symbol
 */
export const CURRENCY_SYMBOL = 'Rs.';
export const CURRENCY_CODE = 'LKR';
