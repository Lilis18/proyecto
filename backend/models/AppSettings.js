import mongoose from "mongoose";

const AppSettingsShema = new mongoose.Schema({
    //El primer y unico SUPER_ADMIN
    superAdminID: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: false, },

    //Control de periodos
    periodsOpen: {
        eneAbr: { type: Boolean, default: false },
        mayAgo: { type: Boolean, default: false },
        sepDic: { type: Boolean, default: false },
    },
}, { timestamps: true });

export default mongoose.model("AppSettings", AppSettingsShema);