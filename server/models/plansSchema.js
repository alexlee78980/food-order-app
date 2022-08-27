import mongoose from "mongoose";

const Schema = mongoose.Schema;

const planSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  meals: { type: Number, required: true },
  count: { type: Number, required: true }
  });

export default mongoose.model('Plan', planSchema);
