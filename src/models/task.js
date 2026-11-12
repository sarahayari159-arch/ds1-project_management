
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },

  deadline: {
    type: Date
  },

  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  utilisateurAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

module.exports = mongoose.model('Task', taskSchema);
