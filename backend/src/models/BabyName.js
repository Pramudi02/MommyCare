const mongoose = require('mongoose');

const BabyNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['girl', 'boy', 'unisex'],
    required: true,
    index: true
  },
  meaning: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

BabyNameSchema.index({ name: 1, gender: 1 }, { unique: true });

module.exports = mongoose.model('BabyName', BabyNameSchema);


