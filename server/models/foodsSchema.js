import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  from: { type: String, required: true  },
  count: { type: Number, required: true  }
});

export default mongoose.model('Food', foodsSchema)
