const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  statut: {
    type: String,
    enum: ['en cours', 'terminé', 'en pause'],
    default: 'en cours'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
 
 isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Project', projectSchema);
