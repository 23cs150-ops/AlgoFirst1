const axios = require('axios');
const path = require('path');
const fs = require('fs');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Read API key from env with fallback to direct env file read
function getOpenRouterApiKey() {
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  // Fallback: read from .env file directly
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/OPENROUTER_API_KEY=(.+?)(\n|$)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (err) {
    console.error('Failed to read .env file:', err.message);
  }

  return null;
}

/**
 * Build a comprehensive AI mentor prompt that analyzes REAL code dynamically
 */
function buildMentorPrompt(payload) {
  const {
    problemTitle,
    problemStatement,
    language,
    userCode,
    verdict,
    stderr,
    failedCase,
  } = payload;

  const failedCaseStr = failedCase ? JSON.stringify(failedCase) : 'N/A';
  const verdictStr = verdict || 'Unknown';
  const stderrStr = stderr || 'N/A';

  return `You are AlgoFirst AI Mentor. Analyze this DSA code submission DYNAMICALLY.

PROBLEM:
Title: ${problemTitle}
Statement: ${problemStatement}

SUBMISSION:
Language: ${language}
Code:
\`\`\`${language}
${userCode}
\`\`\`

EXECUTION RESULT:
Verdict: ${verdictStr}
Error (if any): ${stderrStr}
Failed Test Case: ${failedCaseStr}

ANALYSIS RULES:
1. Infer REAL complexity from ACTUAL code (count loops, recursion, data structures)
2. NEVER assume optimal complexity - analyze what the code actually does
3. NEVER use placeholders or generic responses
4. Detect patterns: two-pointer, sliding window, recursion, dynamic programming, brute force, etc.
5. Detect nested loops and their impact on complexity
6. Detect recursion depth and memoization opportunities
7. Identify hashmap/set/heap usage and their complexity benefits
8. Generate concise, actionable feedback
9. Provide edge case examples that might fail
10. Offer practical interview tips

RETURN STRICT JSON ONLY (no markdown, no extra text):

{
  "verdict": "Accepted|Wrong Answer|Time Limit Exceeded|Runtime Error|etc",
  "isClose": false,
  "rootCause": "Brief explanation of the issue or success",
  "complexity": {
    "time": "Actual complexity from the code (e.g., O(n), O(n log n), O(n²))",
    "space": "Actual space complexity (e.g., O(1), O(n), O(log n))",
    "optimalTime": "Optimal possible complexity for this problem",
    "optimalSpace": "Optimal possible space complexity",
    "efficiencyScore": 0-100
  },
  "scores": {
    "time": 0-100,
    "space": 0-100,
    "readability": 0-100,
    "optimization": 0-100,
    "interview": 0-100
  },
  "pattern": "Detected algorithm pattern (e.g., 'Two Pointer', 'Sliding Window', 'DFS', 'BFS', 'Dynamic Programming', 'Brute Force')",
  "improvements": [
    "Specific, actionable improvement 1",
    "Specific, actionable improvement 2"
  ],
  "hints": [
    "What could you optimize?",
    "Have you considered using a different data structure?"
  ],
  "edgeCases": [
    "Empty array/string",
    "Single element",
    "Duplicate values",
    "Negative numbers"
  ],
  "visualization": [
    {
      "step": 1,
      "description": "Initial state",
      "pseudoCode": "array = [...]"
    }
  ],
  "interviewInsight": "Brief tip about what interviewer would want to see during a real interview discussion of this solution"
}

Analyze the code thoroughly and return only valid JSON.`;
}

/**
 * Call OpenRouter API to get AI mentor analysis
 */
async function callOpenRouterAPI(prompt) {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in server/.env');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://algofirst.dev',
          'X-Title': 'AlgoFirst AI Mentor',
        },
      },
    );

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response data keys:', Object.keys(response.data));

    if (!response.data.choices || response.data.choices.length === 0) {
      console.error('OpenRouter response:', JSON.stringify(response.data, null, 2));
      throw new Error('No response from OpenRouter API');
    }

    const message = response.data.choices[0].message;
    if (!message) {
      console.error('No message in response');
      throw new Error('No message in response from OpenRouter');
    }

    // Try content field first, then reasoning field (for some models)
    let content = message.content;
    if (!content && message.reasoning) {
      content = message.reasoning;
      console.log('Using reasoning field instead of content');
    }

    if (!content) {
      console.error('No content or reasoning in message:', JSON.stringify(message));
      throw new Error('No usable content from OpenRouter response');
    }

    return content.trim();
  } catch (error) {
    console.error('OpenRouter API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    }
    throw new Error(`OpenRouter API failed: ${error.message}`);
  }
}

/**
 * Parse JSON response and validate structure
 */
function parseAndValidateMentorJSON(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);

    // Ensure all required fields exist with defaults
    return {
      verdict: parsed.verdict || 'Unknown',
      isClose: Boolean(parsed.isClose),
      rootCause: parsed.rootCause || 'Unable to determine root cause',
      complexity: {
        time: parsed.complexity?.time || 'O(n)',
        space: parsed.complexity?.space || 'O(1)',
        optimalTime: parsed.complexity?.optimalTime || 'Unknown',
        optimalSpace: parsed.complexity?.optimalSpace || 'Unknown',
        efficiencyScore: Math.min(100, Math.max(0, parsed.complexity?.efficiencyScore || 0)),
      },
      scores: {
        time: Math.min(100, Math.max(0, parsed.scores?.time || 0)),
        space: Math.min(100, Math.max(0, parsed.scores?.space || 0)),
        readability: Math.min(100, Math.max(0, parsed.scores?.readability || 0)),
        optimization: Math.min(100, Math.max(0, parsed.scores?.optimization || 0)),
        interview: Math.min(100, Math.max(0, parsed.scores?.interview || 0)),
      },
      pattern: parsed.pattern || 'Unknown',
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 5) : [],
      hints: Array.isArray(parsed.hints) ? parsed.hints.slice(0, 5) : [],
      edgeCases: Array.isArray(parsed.edgeCases) ? parsed.edgeCases.slice(0, 5) : [],
      visualization: Array.isArray(parsed.visualization) ? parsed.visualization.slice(0, 3) : [],
      interviewInsight: parsed.interviewInsight || '',
    };
  } catch (error) {
    console.error('JSON parse error:', error.message);
    throw new Error(`Invalid JSON response from OpenRouter: ${error.message}`);
  }
}

/**
 * Main function: Analyze code using OpenRouter AI
 */
async function analyzeMentorFeedback(payload) {
  const prompt = buildMentorPrompt(payload);
  const rawResponse = await callOpenRouterAPI(prompt);
  const mentorAnalysis = parseAndValidateMentorJSON(rawResponse);

  return mentorAnalysis;
}

module.exports = {
  analyzeMentorFeedback,
};
