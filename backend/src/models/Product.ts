import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    description: string;
    images: string[];
    categories: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        description: { type: String, required: true },
        images: [{ type: String }],
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    },
    { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
