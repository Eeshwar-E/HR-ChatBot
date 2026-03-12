const User = require('../models/User');

/**
 * Update user preferences including LLM provider
 */
const updatePreferences = async (req, res) => {
  try {
    const { modelPreference } = req.body;
    
    if (!modelPreference) {
      return res.status(400).json({ error: 'Model preference is required' });
    }

    if (!['gemini'].includes(modelPreference)) {
      return res.status(400).json({ error: 'Invalid model preference. Must be "gemini"' });
    }

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { modelPreference },
      { new: true }
    ).select('-passwordHash');

    res.json({ user });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

module.exports = { updatePreferences };