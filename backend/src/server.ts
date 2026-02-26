import app from './app';
import config from './config';
import connectDB from './config/database';

const startServer = async () => {
    await connectDB();

    app.listen(config.port, () => {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
