import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/database';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';

const slugify = (text: string): string =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');

const seed = async (): Promise<void> => {
    try {
        await connectDB();

        // Check if data already exists (skip if already seeded)
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('⏭️  Database already seeded, skipping...');
            await mongoose.disconnect();
            return;
        }

        console.log('🌱 Seeding database...');

        // ── Admin user ──────────────────────────────────────
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });
        console.log('  ✅ Admin user created (admin@example.com / admin123)');

        // ── Regular user ────────────────────────────────────
        const userPassword = await bcrypt.hash('user123', 10);
        await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: userPassword,
            role: 'user',
        });
        console.log('  ✅ Regular user created (user@example.com / user123)');

        // ── Categories ──────────────────────────────────────
        const categoryNames = [
            'Electronics',
            'Clothing',
            'Books',
            'Home & Kitchen',
            'Sports & Outdoors',
        ];

        const categories = await Category.insertMany(
            categoryNames.map((name) => ({ name, slug: slugify(name) }))
        );
        console.log(`  ✅ ${categories.length} categories created`);

        const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

        // ── Products ────────────────────────────────────────
        const products = [
            {
                name: 'Wireless Bluetooth Headphones',
                price: 59.99,
                stock: 150,
                description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and comfortable over-ear design.',
                images: [],
                categories: [catMap['Electronics']],
            },
            {
                name: 'Smartphone Stand & Charger',
                price: 29.99,
                stock: 200,
                description: 'Adjustable phone stand with built-in wireless charging pad. Compatible with all Qi-enabled devices.',
                images: [],
                categories: [catMap['Electronics'], catMap['Home & Kitchen']],
            },
            {
                name: 'Mechanical Gaming Keyboard',
                price: 89.99,
                stock: 75,
                description: 'RGB backlit mechanical keyboard with Cherry MX Blue switches, programmable macros, and USB-C connection.',
                images: [],
                categories: [catMap['Electronics']],
            },
            {
                name: 'Classic Denim Jacket',
                price: 64.99,
                stock: 100,
                description: 'Timeless denim jacket with a modern slim fit. Button-front closure, two chest pockets, durable cotton blend.',
                images: [],
                categories: [catMap['Clothing']],
            },
            {
                name: 'Running Sneakers Pro',
                price: 109.99,
                stock: 60,
                description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and anti-slip rubber sole.',
                images: [],
                categories: [catMap['Clothing'], catMap['Sports & Outdoors']],
            },
            {
                name: 'JavaScript: The Good Parts',
                price: 24.99,
                stock: 300,
                description: 'Classic programming book by Douglas Crockford. Deep-dive into the best features of JavaScript.',
                images: [],
                categories: [catMap['Books']],
            },
            {
                name: 'Clean Code',
                price: 34.99,
                stock: 250,
                description: 'A handbook of agile software craftsmanship by Robert C. Martin. Essential reading for every developer.',
                images: [],
                categories: [catMap['Books']],
            },
            {
                name: 'Stainless Steel Water Bottle',
                price: 19.99,
                stock: 400,
                description: 'Double-wall vacuum insulated water bottle. Keeps drinks cold 24 hours or hot 12 hours. BPA-free, 750ml.',
                images: [],
                categories: [catMap['Sports & Outdoors'], catMap['Home & Kitchen']],
            },
            {
                name: 'Ceramic Coffee Mug Set',
                price: 22.99,
                stock: 180,
                description: 'Set of 4 handcrafted ceramic mugs, 350ml each. Microwave and dishwasher safe. Minimalist matte finish.',
                images: [],
                categories: [catMap['Home & Kitchen']],
            },
            {
                name: 'Yoga Mat Premium',
                price: 39.99,
                stock: 120,
                description: 'Extra-thick 6mm yoga mat with non-slip texture and carrying strap. Eco-friendly TPE material.',
                images: [],
                categories: [catMap['Sports & Outdoors']],
            },
            {
                name: 'LED Desk Lamp',
                price: 44.99,
                stock: 90,
                description: 'Adjustable LED desk lamp with 5 brightness levels, 3 color temperatures, USB charging port, and touch controls.',
                images: [],
                categories: [catMap['Electronics'], catMap['Home & Kitchen']],
            },
            {
                name: 'Cotton T-Shirt Pack (3)',
                price: 29.99,
                stock: 500,
                description: 'Pack of 3 premium 100% cotton crew-neck t-shirts. Pre-shrunk, tagless comfort. Black, white, and gray.',
                images: [],
                categories: [catMap['Clothing']],
            },
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`  ✅ ${createdProducts.length} products created`);

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('  📧 Admin login:  admin@example.com / admin123');
        console.log('  📧 User login:   user@example.com / user123\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Seed failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seed();
