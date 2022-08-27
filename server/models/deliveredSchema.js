import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deliveredSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    date:{type: String, required: true},
    time:{type: String, required: true},
    cell: { type: String, required: true },
    meals:[{type: Schema.Types.Mixed, required:true}],
    additionalMsg:{type: String, required: false},
    claimed:{type: mongoose.Types.ObjectId, required:false, ref: 'User'}
    });

export default mongoose.model('Order', deliveredSchema);
