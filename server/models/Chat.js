const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  messages: { type: [messageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Chat', chatSchema);
