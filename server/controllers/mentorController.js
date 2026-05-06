const { analyzeMentorFeedback } = require('../services/mentorService');

/**
 * POST /api/mentor-analysis
 * Analyze user-submitted code and return AI mentor feedback
 */
async function mentorAnalysisController(req, res) {
  try {
    const { problemTitle, problemStatement, language, userCode, verdict, stderr, failedCase } =
      req.body;

    // Validate required fields
    if (!problemTitle || !problemStatement || !language || !userCode) {
      return res.status(400).json({
        error: 'Missing required fields: problemTitle, problemStatement, language, userCode',
      });
    }

    // Prepare payload
    const payload = {
      problemTitle,
      problemStatement,
      language,
      userCode,
      verdict: verdict || 'Unknown',
      stderr: stderr || '',
      failedCase: failedCase || {},
    };

    // Call AI mentor service
    const mentorAnalysis = await analyzeMentorFeedback(payload);

    // Return structured JSON
    return res.status(200).json({
      success: true,
      data: mentorAnalysis,
    });
  } catch (error) {
    console.error('Mentor analysis error:', error.message);
    return res.status(500).json({
      error: error.message || 'Failed to generate mentor analysis',
    });
  }
}

module.exports = {
  mentorAnalysisController,
};
