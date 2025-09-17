const mongoose = require("mongoose");

const appSettingsSchema = new mongoose.Schema({
  // El primer y único SUPER_ADMIN
  superAdminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("AppSettings", appSettingsSchema);
