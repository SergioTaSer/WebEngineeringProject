import mongoose, { Schema, Types } from 'mongoose';

export interface Product {
  _id?: Types.ObjectId;
  name: string;
  price:number;
  img?: string;
  description: string;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
        required: true,
        min: 0,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  }
 
  
  }
 
 
  
  
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);