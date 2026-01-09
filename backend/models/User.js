const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
   location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
},
    trustScore: { type: Number, default: 50 },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isBanned: {
  type: Boolean,
  default: false
    }   
  },
  { timestamps: true }
);
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
