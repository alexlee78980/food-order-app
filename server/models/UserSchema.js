import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  meals:{type: Number, required:true},
  cell:{ type: String, required: true },
  employee:{type: Boolean, required:true},
  validated:{type: Boolean, required:true}
});

export default mongoose.model('User', UserSchema);
