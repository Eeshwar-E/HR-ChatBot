const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  // Model preference: 'phi3' (local model) or 'openai'
  modelPreference: { type: String, enum: ['phi3', 'openai'], default: process.env.LLM_PROVIDER || 'phi3' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
