const express = require('express');
const { mentorAnalysisController } = require('../controllers/mentorController');

const router = express.Router();

/**
 * POST /api/mentor-analysis
 * Request body:
 * {
 *   "problemTitle": "Two Sum",
 *   "problemStatement": "Find two numbers that add up to target",
 *   "language": "javascript",
 *   "userCode": "...",
 *   "verdict": "Accepted|Wrong Answer|etc",
 *   "stderr": "error message if any",
 *   "failedCase": { "input": [...], "expected": "...", "actual": "..." }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "verdict": "Accepted",
 *     "isClose": false,
 *     "rootCause": "...",
 *     "complexity": { "time": "O(n)", "space": "O(n)", ... },
 *     "scores": { "time": 85, "space": 80, ... },
 *     "pattern": "Hash Map",
 *     "improvements": [...],
 *     "hints": [...],
 *     "edgeCases": [...],
 *     "visualization": [...],
 *     "interviewInsight": "..."
 *   }
 * }
 */
router.post('/mentor-analysis', mentorAnalysisController);

module.exports = router;
