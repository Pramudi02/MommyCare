const mongoose = require('mongoose');

const midwifeMomSchema = new mongoose.Schema({
  midwife: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mom: { type: mongoose.Schema.Types.ObjectId, ref: 'MomProfile', required: true, index: true },
  assignedDate: { type: Date, default: Date.now },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or system
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  notes: String,
}, { timestamps: true });

// Ensure unique midwife-mom combinations
midwifeMomSchema.index({ midwife: 1, mom: 1 }, { unique: true });

let MidwifeMom = null;
const getMidwifeMomModel = () => {
  if (!MidwifeMom) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    if (!authConnection) throw new Error('Auth database connection not available');
    MidwifeMom = authConnection.model('MidwifeMom', midwifeMomSchema);
  }
  return MidwifeMom;
};

module.exports = getMidwifeMomModel;
