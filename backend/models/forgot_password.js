import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    forgotPasswordCode: String,
    expireDate: { type: Date },
    codeUsed: {type: Number, default: 0}
  });

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema);
export default forgotPassword;