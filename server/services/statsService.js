const Submission = require('../models/Submission');

function toUTCDateOnly(d) {
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
}

async function computeUserStats(userId) {
  // total submissions and accepted submissions
  const totalCount = await Submission.countDocuments({ userId });
  const acceptedCount = await Submission.countDocuments({ userId, status: 'Accepted' });

  // solved unique problems: count distinct problemId among Accepted submissions
  const solvedAgg = await Submission.aggregate([
    { $match: { userId: userId, status: 'Accepted' } },
    { $group: { _id: '$problemId' } },
    { $count: 'solved' },
  ]).exec();
  const solvedCount = (solvedAgg[0] && solvedAgg[0].solved) || 0;

  // fetch accepted submission timestamps for streak calculation
  const acceptedSubs = await Submission.find({ userId, status: 'Accepted' })
    .select('createdAt')
    .sort({ createdAt: -1 })
    .lean();

  if (!acceptedSubs || acceptedSubs.length === 0) {
    return {
      totalSubmissions: totalCount,
      acceptedSubmissions: acceptedCount,
      solvedCount,
      acceptanceRate: totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0,
      streak: 0,
      lastSubmissionDate: null,
    };
  }

  // Build a list of unique UTC dates (YYYY-MM-DD) from accepted submissions
  const seen = new Set();
  const uniqueDates = [];
  for (const s of acceptedSubs) {
    const key = toUTCDateOnly(s.createdAt).toISOString();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDates.push(new Date(key));
    }
  }

  // Compute streak ending at most recent accepted date
  let streak = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      streak = 1;
      continue;
    }

    const prev = uniqueDates[i - 1];
    const curr = uniqueDates[i];
    const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return {
    totalSubmissions: totalCount,
    acceptedSubmissions: acceptedCount,
    solvedCount,
    acceptanceRate: totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0,
    streak,
    lastSubmissionDate: acceptedSubs[0].createdAt || null,
  };
}

module.exports = {
  computeUserStats,
};
