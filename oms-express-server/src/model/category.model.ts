import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryId: number;
  nameCategory: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    categoryId: { type: Number, unique: true, required: true },
    nameCategory: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<ICategory>('Category', CategorySchema,'Category');
