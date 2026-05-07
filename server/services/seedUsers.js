const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedDemoUser() {
  try {
    const email = 'dev@algofirst.io';
    const username = 'dev_user';
    const passwordPlain = 'Arena@2026';

    let existing = await User.findOne({ email });
    if (existing) {
      // Ensure username normalized and reset password to known demo password
      existing.username = username.toLowerCase();
      existing.password = passwordPlain; // pre-save hook will hash
      existing.stats = existing.stats || { solvedCount: 0, acceptanceRate: 0, streak: 0, lastSubmissionDate: null };
      await existing.save();
      console.log('Updated existing demo user password:', email);
      return true;
    }

    await User.create({
      username: username.toLowerCase(),
      email,
      password: passwordPlain,
      stats: {
        solvedCount: 0,
        acceptanceRate: 0,
        streak: 0,
        lastSubmissionDate: null,
      },
    });

    console.log('Seeded demo user:', email);
    return true;
  } catch (err) {
    console.error('Failed to seed demo user:', err);
    return false;
  }
}

module.exports = { seedDemoUser };
