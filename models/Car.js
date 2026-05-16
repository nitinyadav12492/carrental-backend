import mongoose from "mongoose";
// const {ObjectId} = mongoose.Schema.Types
const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    image:{
       type:String,
       required:true
    },
    year: {
      type: Number,
      required: true
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    fuel_type: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true
    },
    seating_capacity: {
      type: Number,
      required: true
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic","Semi-Automatic"],
      required: true
    },
   location:{
    type:String, required:true
    },
    description:{
      type:String, required:true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;