const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { timestamps: { updatedAt: false } }
);
exports.userModel = mongoose.model("users", userSchema);
const urlSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    threshold: Number,
    address: String,
    failed_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);
exports.urlModel = mongoose.model("urls", urlSchema);

const requestSchema = new mongoose.Schema(
  {
    url: mongoose.Schema.Types.ObjectId,
    status: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: { updatedAt: false } }
);
exports.requestModel = mongoose.model("requests", requestSchema);
