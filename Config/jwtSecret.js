const crypto = require('crypto');

// Generate a new random secret every time the server starts.
// This ensures all old tokens become invalid on server restart.
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

console.log('🔑 New JWT secret generated (old tokens invalidated)');

module.exports = JWT_SECRET;
