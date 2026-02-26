import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchHistory extends Document {
    user: mongoose.Types.ObjectId;
    keyword: string;
    count: number;
    lastSearchedAt: Date;
}

const searchHistorySchema = new Schema<ISearchHistory>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    keyword: { type: String, required: true, lowercase: true, trim: true },
    count: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
});

// Compound index: one record per user+keyword
searchHistorySchema.index({ user: 1, keyword: 1 }, { unique: true });

export default mongoose.model<ISearchHistory>('SearchHistory', searchHistorySchema);
