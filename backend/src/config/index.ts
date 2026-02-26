import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '5000', 10),
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/preneur-ecommerce',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;
