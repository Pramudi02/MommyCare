const mongoose = require('mongoose');

const babyNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  gender: {
    type: String,
    enum: ['boy', 'girl', 'unisex'],
    required: [true, 'Gender is required']
  },
  meaning: {
    type: String,
    required: [true, 'Meaning is required'],
    trim: true,
    maxlength: [500, 'Meaning cannot be more than 500 characters']
  },
  popularity: {
    type: Number,
    required: [true, 'Popularity score is required'],
    min: [0, 'Popularity cannot be negative'],
    max: [100, 'Popularity cannot exceed 100']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
babyNameSchema.index({ name: 1 }, { unique: true });
babyNameSchema.index({ gender: 1 });
babyNameSchema.index({ popularity: -1 });

const getBabyNameModel = () => {
  if (mongoose.models.BabyName) {
    return mongoose.models.BabyName;
  }
  return mongoose.model('BabyName', babyNameSchema);
};

module.exports = getBabyNameModel;
