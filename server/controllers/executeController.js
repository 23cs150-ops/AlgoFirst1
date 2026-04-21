const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { executeCode } = require('../services/judge0Service');

function normalizeOutput(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace(/\r\n/g, '\n').trim();
}

function stripSurroundingQuotes(value) {
  let text = normalizeOutput(value);

  while (
    text.length >= 2 &&
    ((text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'")))
  ) {
    text = text.slice(1, -1).trim();
  }

  return text;
}

function tryParsePrimitiveJson(value) {
  const text = normalizeOutput(value);

  if (!text) {
    return text;
  }

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'string') {
      return normalizeOutput(parsed);
    }

    if (typeof parsed === 'number' || typeof parsed === 'boolean') {
      return String(parsed);
    }
  } catch {
    // Ignore parse failures; fall back to text normalization.
  }

  return text;
}

function normalizeComparableText(value) {
  const jsonNormalized = tryParsePrimitiveJson(value);
  return stripSurroundingQuotes(jsonNormalized);
}

function isNumericText(value) {
  return /^[-+]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[-+]?\d+)?$/i.test(value);
}

function outputsMatch(expectedRaw, actualRaw) {
  const expected = normalizeComparableText(expectedRaw);
  const actual = normalizeComparableText(actualRaw);

  if (expected === actual) {
    return true;
  }

  const expectedUnquoted = expected;
  const actualUnquoted = actual;

  if (expectedUnquoted === actualUnquoted) {
    return true;
  }

  // Handle boolean outputs regardless of case differences.
  if ((expectedUnquoted.toLowerCase() === 'true' || expectedUnquoted.toLowerCase() === 'false') &&
      (actualUnquoted.toLowerCase() === 'true' || actualUnquoted.toLowerCase() === 'false')) {
    return expectedUnquoted.toLowerCase() === actualUnquoted.toLowerCase();
  }

  // Allow equivalent numeric formatting, e.g. 2.0 vs 2.00000.
  if (isNumericText(expectedUnquoted) && isNumericText(actualUnquoted)) {
    const expectedNum = Number(expectedUnquoted);
    const actualNum = Number(actualUnquoted);

    if (Number.isFinite(expectedNum) && Number.isFinite(actualNum)) {
      const diff = Math.abs(expectedNum - actualNum);
      return diff <= 1e-9;
    }
  }

  return false;
}

function formatRuntimeMs(timeSeconds) {
  if (!timeSeconds) {
    return null;
  }

  const numeric = Number(timeSeconds);
  if (Number.isNaN(numeric)) {
    return null;
  }

  return String(Math.round(numeric * 1000));
}

function deriveFinalStatus(testResults) {
  if (testResults.some((result) => result.compile_output)) {
    return 'Compilation Error';
  }

  if (testResults.some((result) => result.timeout)) {
    return 'Time Limit Exceeded';
  }

  if (testResults.some((result) => result.stderr)) {
    return 'Runtime Error';
  }

  if (testResults.some((result) => !result.passed)) {
    return 'Wrong Answer';
  }

  return 'Accepted';
}

function hasJavaMain(sourceCode) {
  return /\bpublic\s+class\s+Main\b/.test(sourceCode) || /\bclass\s+Main\b/.test(sourceCode);
}

  function buildGenericJavaWrapper() {
    return `
  public class Main {
    private static String[] readInputLines() throws Exception {
      BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
      java.util.List<String> lines = new java.util.ArrayList<>();
      String line;
      while ((line = br.readLine()) != null) {
        lines.add(line);
      }
      return lines.toArray(new String[0]);
    }

    private static String stripQuotes(String s) {
      if (s == null) return "";
      s = s.trim();
      if (s.length() >= 2 && s.charAt(0) == '\"' && s.charAt(s.length() - 1) == '\"') {
        return s.substring(1, s.length() - 1);
      }
      return s;
    }

    private static int[] parseIntArray(String raw) {
      String s = raw == null ? "" : raw.trim();
      if (s.length() <= 2) return new int[0];
      if (s.startsWith("[") && s.endsWith("]")) {
        s = s.substring(1, s.length() - 1).trim();
      }
      if (s.isEmpty()) return new int[0];
      String[] parts = s.split(",");
      int[] arr = new int[parts.length];
      for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim());
      return arr;
    }

    private static Object buildListNode(int[] values, Class<?> nodeClass) throws Exception {
      if (values.length == 0) return null;

      Constructor<?> valueCtor = null;
      Constructor<?> noArgCtor = null;
      for (Constructor<?> ctor : nodeClass.getDeclaredConstructors()) {
        ctor.setAccessible(true);
        if (ctor.getParameterCount() == 1 && (ctor.getParameterTypes()[0] == int.class || ctor.getParameterTypes()[0] == Integer.class)) {
          valueCtor = ctor;
        }
        if (ctor.getParameterCount() == 0) {
          noArgCtor = ctor;
        }
      }

      Field valField = nodeClass.getDeclaredField("val");
      Field nextField = nodeClass.getDeclaredField("next");
      valField.setAccessible(true);
      nextField.setAccessible(true);

      Object head = null;
      Object current = null;

      for (int value : values) {
        Object node;
        if (valueCtor != null) {
          node = valueCtor.newInstance(value);
        } else if (noArgCtor != null) {
          node = noArgCtor.newInstance();
          valField.set(node, value);
        } else {
          throw new RuntimeException("ListNode constructor not found");
        }

        if (head == null) {
          head = node;
          current = node;
        } else {
          nextField.set(current, node);
          current = node;
        }
      }

      return head;
    }

    private static Object parseArg(String raw, Class<?> type, String paramName) throws Exception {
      String s = raw == null ? "" : raw.trim();

      if (type == int.class || type == Integer.class) {
        return Integer.parseInt(s);
      }
      if (type == long.class || type == Long.class) {
        return Long.parseLong(s);
      }
      if (type == double.class || type == Double.class) {
        return Double.parseDouble(s);
      }
      if (type == boolean.class || type == Boolean.class) {
        return Boolean.parseBoolean(s.toLowerCase());
      }
      if (type == String.class) {
        return stripQuotes(s);
      }
      if (type.isArray() && type.getComponentType() == int.class) {
        return parseIntArray(s);
      }
      if (type.getSimpleName().equals("ListNode")) {
        return buildListNode(parseIntArray(s), type);
      }

      // Fallback to raw string for unsupported parameter types.
      return stripQuotes(s);
    }

    private static String intArrayToString(int[] arr) {
      StringBuilder sb = new StringBuilder();
      sb.append("[");
      for (int i = 0; i < arr.length; i++) {
        if (i > 0) sb.append(",");
        sb.append(arr[i]);
      }
      sb.append("]");
      return sb.toString();
    }

    private static String listNodeToString(Object node) throws Exception {
      if (node == null) return "[]";

      Class<?> cls = node.getClass();
      Field valField = cls.getDeclaredField("val");
      Field nextField = cls.getDeclaredField("next");
      valField.setAccessible(true);
      nextField.setAccessible(true);

      StringBuilder sb = new StringBuilder();
      sb.append("[");
      Object cur = node;
      boolean first = true;
      while (cur != null) {
        if (!first) sb.append(",");
        sb.append(valField.get(cur));
        cur = nextField.get(cur);
        first = false;
      }
      sb.append("]");
      return sb.toString();
    }

    private static String stringify(Object result) throws Exception {
      if (result == null) return "";
      if (result instanceof Boolean) return ((Boolean) result) ? "true" : "false";
      if (result instanceof int[]) return intArrayToString((int[]) result);
      if (result.getClass().getSimpleName().equals("ListNode")) return listNodeToString(result);
      return String.valueOf(result);
    }

    private static Method pickMethod(Class<?> cls) {
      Method picked = null;
      for (Method method : cls.getDeclaredMethods()) {
        if (!Modifier.isPublic(method.getModifiers())) continue;
        if (method.isSynthetic()) continue;
        picked = method;
        break;
      }

      if (picked == null) {
        throw new RuntimeException("No public method found in Solution class.");
      }

      picked.setAccessible(true);
      return picked;
    }

    public static void main(String[] args) throws Exception {
      String[] lines = readInputLines();

      Class<?> solutionClass = Class.forName("Solution");
      Object solutionInstance = solutionClass.getDeclaredConstructor().newInstance();

      Method method = pickMethod(solutionClass);
      Class<?>[] paramTypes = method.getParameterTypes();
      Parameter[] params = method.getParameters();
      Object[] callArgs = new Object[paramTypes.length];

      for (int i = 0; i < paramTypes.length; i++) {
        String line = i < lines.length ? lines[i] : "";
        String paramName = i < params.length ? params[i].getName() : "arg" + i;
        callArgs[i] = parseArg(line, paramTypes[i], paramName);
      }

      Object result = method.invoke(solutionInstance, callArgs);
      String output = stringify(result);
      if (output != null && !output.isEmpty()) {
        System.out.print(output);
      }
    }
  }
  `.trim();
  }

  function hasPythonEntrypoint(sourceCode) {
    return /if\s+__name__\s*==\s*['\"]__main__['\"]\s*:/.test(sourceCode);
  }

  function hasPythonSolutionClass(sourceCode) {
    return /class\s+Solution\s*[:\(]/.test(sourceCode);
  }

  function buildGenericPythonWrapper() {
    return [
    'import inspect',
    'import json',
    'import sys',
    '',
    "def _af_parse(line):",
    "    text = (line or '').strip()",
    "    if text == '':",
    "        return ''",
    '    try:',
    '        return json.loads(text)',
    '    except Exception:',
    "        if len(text) >= 2 and text[0] == '\"' and text[-1] == '\"':",
    '            return text[1:-1]',
    '        return text',
    '',
    'def _af_build_listnode(values):',
    "    cls = globals().get('ListNode')",
    '    if cls is None:',
    '        return values',
    '    if not isinstance(values, list):',
    '        return values',
    '',
    '    head = None',
    '    cur = None',
    '    for value in values:',
    '        node = cls(value)',
    '        if head is None:',
    '            head = node',
    '            cur = node',
    '        else:',
    '            cur.next = node',
    '            cur = node',
    '    return head',
    '',
    'def _af_prepare_arg(value, param_name):',
    "    if globals().get('ListNode') is not None and isinstance(value, list) and str(param_name).startswith('l'):",
    '        return _af_build_listnode(value)',
    '    return value',
    '',
    'def _af_listnode_to_list(node):',
    '    out = []',
    '    cur = node',
    '    guard = 0',
    '    while cur is not None and guard < 100000:',
    "        out.append(getattr(cur, 'val', None))",
    "        cur = getattr(cur, 'next', None)",
    '        guard += 1',
    '    return out',
    '',
    'def _af_stringify(value):',
    '    if value is None:',
    "        return ''",
    '    if isinstance(value, bool):',
    "        return 'true' if value else 'false'",
    '    if isinstance(value, (list, tuple)):',
    "        return json.dumps(list(value), separators=(',', ':'))",
    "    if hasattr(value, 'val') and hasattr(value, 'next'):",
    "        return json.dumps(_af_listnode_to_list(value), separators=(',', ':'))",
    '    return str(value)',
    '',
    'def _af_pick_callable():',
    "    solution_cls = globals().get('Solution')",
    '    if solution_cls is not None:',
    '        instance = solution_cls()',
    '        names = [',
    '            name for name in dir(instance)',
    "            if not name.startswith('_') and callable(getattr(instance, name))",
    '        ]',
    '        if not names:',
    "            raise RuntimeError('No callable method found in Solution class.')",
    '        return getattr(instance, names[0])',
    '',
    '    for name, obj in globals().items():',
    "        if name.startswith('_af_'):",
    '            continue',
    '        if callable(obj):',
    '            return obj',
    '',
    "    raise RuntimeError('No callable solution function found.')",
    '',
    'def _af_run():',
    '    lines = sys.stdin.read().splitlines()',
    '    func = _af_pick_callable()',
    '    sig = inspect.signature(func)',
    '    params = list(sig.parameters.values())',
    '',
    '    args = []',
    '    for index, param in enumerate(params):',
    "        raw = lines[index] if index < len(lines) else ''",
    '        parsed = _af_parse(raw)',
    '        args.append(_af_prepare_arg(parsed, param.name))',
    '',
    '    result = func(*args)',
    '    rendered = _af_stringify(result)',
    '    if rendered:',
    '        sys.stdout.write(rendered)',
    '',
    '_af_run()',
    ].join('\n');
  }

function prepareJavaSource(sourceCode, problemId) {
  if (hasJavaMain(sourceCode)) {
    return sourceCode;
  }

    const wrapper = buildGenericJavaWrapper();
    return `import java.io.*;\nimport java.util.*;\nimport java.lang.reflect.*;\n\n${sourceCode.trim()}\n\n${wrapper}\n`;
}

  function preparePythonSource(sourceCode) {
    if (hasPythonEntrypoint(sourceCode)) {
    return sourceCode;
    }

    if (!hasPythonSolutionClass(sourceCode)) {
    return sourceCode;
    }

    return `${sourceCode.trim()}\n\n${buildGenericPythonWrapper()}\n`;
  }

function prepareSourceForJudge(sourceCode, languageId, problemId) {
  if (Number(languageId) === 62) {
    return prepareJavaSource(sourceCode, problemId);
  }

    if (Number(languageId) === 71) {
    return preparePythonSource(sourceCode);
    }

  return sourceCode;
}

function mapLanguageIdToClientLanguage(languageId) {
  const mapping = {
    54: 'cpp',
    71: 'python3',
    62: 'java',
    63: 'javascript',
    74: 'typescript',
    60: 'go',
    73: 'rust',
    50: 'c',
  };

  return mapping[Number(languageId)] || String(languageId || 'unknown');
}

function normalizeRuntimeLabel(value) {
  if (!value) {
    return 'N/A';
  }

  const text = String(value).trim();
  if (!text) {
    return 'N/A';
  }

  return text.endsWith('ms') ? text : `${text} ms`;
}

function toProblemSlug(value) {
  const raw = String(value || '')
    .trim()
    .toLowerCase();

  if (!raw) {
    return 'problem';
  }

  return raw
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'problem';
}

function buildProblemSnapshot(snapshot, problemId) {
  if (!snapshot) {
    return null;
  }

  const test_cases = Array.isArray(snapshot.test_cases)
    ? snapshot.test_cases
        .filter((tc) => typeof tc?.input === 'string' && typeof tc?.expected_output === 'string')
        .map((tc) => ({
          input: tc.input,
          expected_output: tc.expected_output,
        }))
    : [];

  if (test_cases.length === 0) {
    return null;
  }

  return {
    problemKey: problemId,
    slug: toProblemSlug(snapshot.slug || problemId),
    title: snapshot.title || `Problem ${problemId}`,
    description: snapshot.description || '',
    input_format: snapshot.input_format || '',
    output_format: snapshot.output_format || '',
    test_cases,
  };
}

async function ensureProblem(problemId, problemSnapshot) {
  let problem = await Problem.findOne({ problemKey: problemId });

  if (problem) {
    return problem;
  }

  const normalizedSnapshot = buildProblemSnapshot(problemSnapshot, problemId);
  if (!normalizedSnapshot) {
    return null;
  }

  problem = await Problem.create(normalizedSnapshot);
  return problem;
}

async function executeController(req, res) {
  try {
    const { source_code, language_id, problemId, userId = null, problemSnapshot = null } = req.body;

    if (!source_code || !language_id || !problemId) {
      return res.status(400).json({
        message: 'source_code, language_id, and problemId are required.',
      });
    }

    const problem = await ensureProblem(problemId, problemSnapshot);

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found in database and no valid snapshot was provided.',
      });
    }

    if (!Array.isArray(problem.test_cases) || problem.test_cases.length === 0) {
      return res.status(400).json({
        message: 'Problem has no test cases configured.',
      });
    }

    const testResults = [];
    const executableSource = prepareSourceForJudge(source_code, language_id, problemId);

    for (const [index, testCase] of problem.test_cases.entries()) {
      const judgeResult = await executeCode(executableSource, language_id, testCase.input);

      const expected = normalizeOutput(testCase.expected_output);
      const actual = normalizeOutput(judgeResult.stdout);
      const timeout = judgeResult.status?.id === 5;
      const compileError = judgeResult.compile_output ? normalizeOutput(judgeResult.compile_output) : null;
      const runtimeError = judgeResult.stderr ? normalizeOutput(judgeResult.stderr) : null;
      const timeoutMessage = timeout ? 'Execution timed out.' : null;
      const noOutputMessage = 'No output produced by the submitted code.';
      const actualOutput = judgeResult.stdout ?? runtimeError ?? compileError ?? timeoutMessage ?? noOutputMessage;

      const passed = !compileError && !runtimeError && !timeout && outputsMatch(expected, actual);

      testResults.push({
        id: `tc-${index + 1}`,
        input: testCase.input,
        expected_output: testCase.expected_output,
        actual_output: actualOutput,
        passed,
        runtime: formatRuntimeMs(judgeResult.time),
        stdout: judgeResult.stdout ?? null,
        stderr: runtimeError,
        compile_output: compileError,
        timeout,
      });
    }

    const status = deriveFinalStatus(testResults);

    const firstError = testResults.find((result) => result.compile_output || result.stderr || result.timeout || !result.passed) || null;

    const submissionRecord = await Submission.create({
      userId,
      problemId,
      code: executableSource,
      language_id,
      status,
      stdout: firstError?.stdout ?? testResults[0]?.stdout ?? null,
      stderr: firstError?.timeout ? 'Execution timed out.' : firstError?.stderr ?? null,
      compile_output: firstError?.compile_output ?? null,
      testResults: testResults.map((result) => ({
        input: result.input,
        expected_output: result.expected_output,
        actual_output: result.actual_output,
        passed: result.passed,
        runtime: result.runtime,
      })),
    });

    return res.status(200).json({
      submissionId: submissionRecord._id,
      status,
      testResults: testResults.map((result) => ({
        id: result.id,
        input: result.input,
        expected_output: result.expected_output,
        actual_output: result.actual_output,
        passed: result.passed,
        runtime: result.runtime,
      })),
      stdout: submissionRecord.stdout,
      stderr: submissionRecord.stderr,
      compile_output: submissionRecord.compile_output,
      runtime: testResults.find((result) => Boolean(result.runtime))?.runtime || null,
      memory: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Execution failed.',
    });
  }
}

async function getSubmissionsController(req, res) {
  try {
    const { problemId, userId } = req.query;

    const query = {};
    if (problemId) {
      query.problemId = String(problemId);
    }
    if (userId) {
      query.userId = String(userId);
    }

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const response = submissions.map((submission) => {
      const runtimeRaw =
        submission.testResults?.find((item) => item?.runtime)?.runtime || null;

      return {
        id: String(submission._id),
        problemId: submission.problemId,
        language: mapLanguageIdToClientLanguage(submission.language_id),
        status: submission.status,
        runtime: normalizeRuntimeLabel(runtimeRaw),
        memory: 'N/A',
        submittedAt: submission.createdAt,
        code: submission.code,
      };
    });

    return res.status(200).json({ submissions: response });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to load submissions.',
    });
  }
}

module.exports = {
  executeController,
  getSubmissionsController,
};
