const { computeUserStats } = require('../services/statsService');

async function getProfileStatsController(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const stats = await computeUserStats(String(userId));
    return res.status(200).json({ success: true, stats });
  } catch (err) {
    console.error('Failed to compute profile stats:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute stats' });
  }
}

module.exports = { getProfileStatsController };
