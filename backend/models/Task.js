const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,

    status: {
      type: String,
      enum: ['OPEN', 'ACCEPTED', 'COMPLETED'],
      default: 'OPEN'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // ✅ GEOJSON LOCATION (MANDATORY)
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
    }
  },
  { timestamps: true }
);

/* ✅ GEOSPATIAL INDEX (MANDATORY) */
taskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Task', taskSchema);
