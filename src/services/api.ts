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

// Add authorization header interceptor to include Bearer token from localStorage
api.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('authToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

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

export interface ProfileStatsResponse {
	success: boolean;
	stats: {
		totalSubmissions: number;
		acceptedSubmissions: number;
		solvedCount: number;
		acceptanceRate: number;
		streak: number;
		lastSubmissionDate: string | null;
	};
}

export async function fetchProfileStats(): Promise<ProfileStatsResponse> {
	const response = await api.get<ProfileStatsResponse>('/api/profile/stats');
	return response.data;
}

export interface MentorAnalysisRequest {
	problemTitle: string;
	problemStatement: string;
	language: string;
	userCode: string;
	verdict: string;
	stderr?: string;
	failedCase?: {
		input?: string;
		expected?: string;
		actual?: string;
	};
}

export interface MentorAnalysisResponse {
	success: boolean;
	data: {
		verdict: string;
		isClose: boolean;
		rootCause: string;
		complexity: {
			time: string;
			space: string;
			optimalTime: string;
			optimalSpace: string;
			efficiencyScore: number;
		};
		scores: {
			time: number;
			space: number;
			readability: number;
			optimization: number;
			interview: number;
		};
		pattern: string;
		improvements: string[];
		hints: string[];
		edgeCases: string[];
		visualization: Array<{
			step: number;
			description: string;
			pseudoCode: string;
		}>;
		interviewInsight: string;
	};
}

export async function getMentorAnalysis(
	payload: MentorAnalysisRequest,
): Promise<MentorAnalysisResponse> {
	const response = await api.post<MentorAnalysisResponse>('/api/mentor-analysis', payload);
	return response.data;
}

export async function fetchCurrentUser() {
	const response = await api.get('/api/auth/me');
	return response.data;
}
