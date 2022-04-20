const mongoose = require("mongoose");

const referSchema = new mongoose.Schema({
  referLink: {
    type: String,
  },
  account: {
    required: true,
    type: String,
  },
  referUser: [
    {
      type: String,
      // unique: true,
    },
  ],
  referCount: { type: Number, default: 0 },
  referPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model("referSchema", referSchema);
