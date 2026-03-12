const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  // Model preference: Gemini is the only supported model
  modelPreference: { type: String, enum: ['gemini'], default: process.env.LLM_PROVIDER || 'gemini' },
  // for password reset flow
  resetToken: { type: String },
  resetExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
