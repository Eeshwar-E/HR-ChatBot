const { Schema, model, Types } = require('mongoose');

const evaluationSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  resumeText: { type: String, required: true },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  score: { type: Number },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Evaluation', evaluationSchema);
