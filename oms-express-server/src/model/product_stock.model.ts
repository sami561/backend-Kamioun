import mongoose, { Document, Schema } from 'mongoose';

interface IProductStock extends Document {
  product_id: number;
  sku: string;
  stock: {
    store_id: number;
    quantity: number;
    price: number;
  }[];
}

const ProductStockSchema: Schema = new Schema({
  product_id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true 
  },
  stock: [{
    store_id: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      default: 0 
    },
    price: { 
      type: Number, 
      required: true 
    }
  }]
}, { 
  timestamps: true,
  versionKey: false
});

// Indexes for optimized queries
ProductStockSchema.index({ product_id: 1 });
ProductStockSchema.index({ 
  product_id: 1,
  'stock.store_id': 1 
});
ProductStockSchema.index({ sku: 1 }, { unique: true, sparse: true }); // ✅ Fix for null SKU error

export default mongoose.model<IProductStock>(
  'ProductStock',
  ProductStockSchema,
  'products_stock'
);
