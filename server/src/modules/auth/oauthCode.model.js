import mongoose from "mongoose";

const oauthCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  codeHash: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

const OAuthCode = mongoose.model("OAuthCode", oauthCodeSchema);

export default OAuthCode;
