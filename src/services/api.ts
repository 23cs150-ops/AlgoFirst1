import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface ExecuteProblemSnapshot {
	title: string;
	description: string;
	input_format?: string;
	output_format?: string;
	test_cases: {
		input: string;
		expected_output: string;
	}[];
}

export interface ExecuteCodeRequest {
	source_code: string;
	language_id: number;
	problemId: string;
	userId?: string;
	problemSnapshot?: ExecuteProblemSnapshot;
}

export interface ExecuteCodeResponse {
	submissionId: string;
	status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
	testResults: {
		id: string;
		input: string;
		expected_output: string;
		actual_output: string;
		passed: boolean;
		runtime: string | null;
	}[];
	stdout: string | null;
	stderr: string | null;
	compile_output: string | null;
	runtime: string | null;
	memory: string | null;
}

export interface PersistedSubmission {
	id: string;
	problemId: string;
	language: string;
	status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error' | 'Pending';
	runtime: string;
	memory: string;
	submittedAt: string;
	code?: string;
}

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export async function executeCode(payload: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
	const response = await api.post<ExecuteCodeResponse>('/api/execute', payload);
	return response.data;
}

export async function fetchSubmissions(problemId?: string): Promise<PersistedSubmission[]> {
	const response = await api.get<{ submissions: PersistedSubmission[] }>('/api/submissions', {
		params: problemId ? { problemId } : undefined,
	});

	return response.data.submissions;
}
