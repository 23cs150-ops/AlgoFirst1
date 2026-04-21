const axios = require('axios');

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com';
const REQUEST_TIMEOUT_MS = Number(process.env.JUDGE0_TIMEOUT_MS || 20000);

function buildJudge0Headers() {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.JUDGE0_RAPIDAPI_KEY && process.env.JUDGE0_RAPIDAPI_HOST) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_RAPIDAPI_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_RAPIDAPI_HOST;
  }

  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.JUDGE0_AUTH_TOKEN}`;
  }

  return headers;
}

async function executeCode(source_code, language_id, stdin) {
  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code,
        language_id,
        stdin,
      },
      {
        headers: buildJudge0Headers(),
        timeout: REQUEST_TIMEOUT_MS,
      },
    );

    return {
      stdout: response.data.stdout ?? null,
      stderr: response.data.stderr ?? null,
      compile_output: response.data.compile_output ?? null,
      status: response.data.status || { id: 0, description: 'Unknown' },
      time: response.data.time ?? null,
      memory: response.data.memory ?? null,
      token: response.data.token ?? null,
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        stdout: null,
        stderr: 'Execution timed out while waiting for Judge0 response.',
        compile_output: null,
        status: { id: 5, description: 'Time Limit Exceeded' },
        time: null,
        memory: null,
        token: null,
      };
    }

    if (error.response) {
      const statusText = error.response.data?.message || error.response.statusText || 'Judge0 request failed';
      throw new Error(statusText);
    }

    throw new Error('Unable to reach Judge0 service.');
  }
}

module.exports = {
  executeCode,
};
