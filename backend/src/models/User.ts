import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    purchasedProducts: mongoose.Types.ObjectId[];
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        purchasedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        refreshToken: { type: String, default: null },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
