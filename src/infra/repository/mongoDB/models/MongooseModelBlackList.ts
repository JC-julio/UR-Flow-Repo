import mongoose from "mongoose";

export const TokenSchema = new mongoose.Schema({
    bannedToken: String,
})

const TokenModel = mongoose.model('BlackList', TokenSchema);
export default TokenModel;