require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pulseforge_fitness',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'pulseforge_jwt_access_super_secret_key_minimum_64_bytes_secure_signature_ok',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'pulseforge_jwt_refresh_super_secret_key_minimum_64_bytes_secure_signature_ok',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};

module.exports = env;
