export interface Problem {
  id: string;
  slug: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  solvedCount: number;
  isPremium: boolean;
  description: string;
  constraints: string[];
  examples: {
    id: string;
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<string, string>;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
  }[];
}

export interface Submission {
  id: string;
  problemId: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error' | 'Pending';
  runtime: string;
  memory: string;
  submittedAt: string;
  code?: string;
}

export const LANGUAGES = [
  { id: 'cpp', label: 'C++ 17', judge0Id: 54, monacoLang: 'cpp' },
  { id: 'python3', label: 'Python 3', judge0Id: 71, monacoLang: 'python' },
  { id: 'java', label: 'Java 17', judge0Id: 62, monacoLang: 'java' },
  { id: 'javascript', label: 'JavaScript', judge0Id: 63, monacoLang: 'javascript' },
  { id: 'typescript', label: 'TypeScript', judge0Id: 74, monacoLang: 'typescript' },
  { id: 'go', label: 'Go', judge0Id: 60, monacoLang: 'go' },
  { id: 'rust', label: 'Rust', judge0Id: 73, monacoLang: 'rust' },
  { id: 'c', label: 'C', judge0Id: 50, monacoLang: 'c' },
];

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'prob-001',
    slug: 'two-sum',
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    acceptanceRate: 49.3,
    totalSubmissions: 14820340,
    solvedCount: 7307427,
    isPremium: false,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to* \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    examples: [
      {
        id: 'ex-001-1',
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        id: 'ex-001-2',
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        id: 'ex-001-3',
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};`,
      python3: `from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your solution here\n    return [];\n};`,
      go: `func twoSum(nums []int, target int) []int {\n    // Write your solution here\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Write your solution here\n        vec![]\n    }\n}`,
      c: `#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    return NULL;\n}`,
    },
    testCases: [
      { id: 'tc-001-1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { id: 'tc-001-2', input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { id: 'tc-001-3', input: '[3,3]\n6', expectedOutput: '[0,1]' },
    ],
  },
  {
    id: 'prob-002',
    slug: 'add-two-numbers',
    number: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math', 'Recursion'],
    acceptanceRate: 41.7,
    totalSubmissions: 8934120,
    solvedCount: 3725432,
    isPremium: false,
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 ≤ Node.val ≤ 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.',
    ],
    examples: [
      {
        id: 'ex-002-1',
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.',
      },
      {
        id: 'ex-002-2',
        input: 'l1 = [0], l2 = [0]',
        output: '[0]',
      },
    ],
    starterCode: {
      cpp: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        // Write your solution here\n    }\n};`,
      python3: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`,
      java: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        return null;\n    }\n}`,
      javascript: `var addTwoNumbers = function(l1, l2) {\n    // Write your solution here\n};`,
      typescript: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n    return null;\n}`,
      go: `func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {\n        None\n    }\n}`,
      c: `struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {\n    return NULL;\n}`,
    },
    testCases: [
      { id: 'tc-002-1', input: '[2,4,3]\n[5,6,4]', expectedOutput: '[7,0,8]' },
      { id: 'tc-002-2', input: '[0]\n[0]', expectedOutput: '[0]' },
    ],
  },
  {
    id: 'prob-003',
    slug: 'longest-substring-without-repeating',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 34.1,
    totalSubmissions: 11203450,
    solvedCount: 3820376,
    isPremium: false,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    examples: [
      {
        id: 'ex-003-1',
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        id: 'ex-003-2',
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    starterCode: {
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      python3: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
      javascript: `var lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n    return 0;\n}`,
      go: `func lengthOfLongestSubstring(s string) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn length_of_longest_substring(s: String) -> i32 {\n        0\n    }\n}`,
      c: `int lengthOfLongestSubstring(char* s) {\n    return 0;\n}`,
    },
    testCases: [
      { id: 'tc-003-1', input: '"abcabcbb"', expectedOutput: '3' },
      { id: 'tc-003-2', input: '"bbbbb"', expectedOutput: '1' },
      { id: 'tc-003-3', input: '"pwwkew"', expectedOutput: '3' },
    ],
  },
  {
    id: 'prob-004',
    slug: 'median-of-two-sorted-arrays',
    number: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 38.6,
    totalSubmissions: 5621340,
    solvedCount: 2169797,
    isPremium: false,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 ≤ m ≤ 1000',
      '0 ≤ n ≤ 1000',
      '1 ≤ m + n ≤ 2000',
      '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    ],
    examples: [
      {
        id: 'ex-004-1',
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        id: 'ex-004-2',
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};`,
      python3: `from typing import List\n\nclass Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}`,
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {\n};`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n    return 0;\n}`,
      go: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {\n        0.0\n    }\n}`,
      c: `double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    return 0.0;\n}`,
    },
    testCases: [
      { id: 'tc-004-1', input: '[1,3]\n[2]', expectedOutput: '2.00000' },
      { id: 'tc-004-2', input: '[1,2]\n[3,4]', expectedOutput: '2.50000' },
    ],
  },
  {
    id: 'prob-005',
    slug: 'valid-parentheses',
    number: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    acceptanceRate: 40.7,
    totalSubmissions: 9834120,
    solvedCount: 4002427,
    isPremium: false,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      "s consists of parentheses only '()[]{}'.",
    ],
    examples: [
      { id: 'ex-005-1', input: 's = "()"', output: 'true' },
      { id: 'ex-005-2', input: 's = "()[]{}"', output: 'true' },
      { id: 'ex-005-3', input: 's = "(]"', output: 'false', explanation: 'Brackets do not match.' },
    ],
    starterCode: {
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};`,
      python3: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
      javascript: `var isValid = function(s) {\n};`,
      typescript: `function isValid(s: string): boolean {\n    return false;\n}`,
      go: `func isValid(s string) bool {\n    return false\n}`,
      rust: `impl Solution {\n    pub fn is_valid(s: String) -> bool {\n        false\n    }\n}`,
      c: `bool isValid(char* s) {\n    return false;\n}`,
    },
    testCases: [
      { id: 'tc-005-1', input: '"()"', expectedOutput: 'true' },
      { id: 'tc-005-2', input: '"()[]{}"', expectedOutput: 'true' },
      { id: 'tc-005-3', input: '"(]"', expectedOutput: 'false' },
    ],
  },
  {
    id: 'prob-006',
    slug: 'merge-two-sorted-lists',
    number: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    acceptanceRate: 62.4,
    totalSubmissions: 8234120,
    solvedCount: 5138051,
    isPremium: false,
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn *the head of the merged linked list*.`,
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 ≤ Node.val ≤ 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    examples: [
      {
        id: 'ex-006-1',
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
      },
      {
        id: 'ex-006-2',
        input: 'list1 = [], list2 = []',
        output: '[]',
      },
    ],
    starterCode: {
      cpp: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        return nullptr;\n    }\n};`,
      python3: `from typing import Optional\n\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`,
      java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}`,
      javascript: `var mergeTwoLists = function(list1, list2) {\n};`,
      typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n    return null;\n}`,
      go: `func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn merge_two_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {\n        None\n    }\n}`,
      c: `struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    return NULL;\n}`,
    },
    testCases: [
      { id: 'tc-006-1', input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { id: 'tc-006-2', input: '[]\n[]', expectedOutput: '[]' },
    ],
  },
  {
    id: 'prob-007',
    slug: 'maximum-subarray',
    number: 53,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    acceptanceRate: 50.2,
    totalSubmissions: 7823450,
    solvedCount: 3927465,
    isPremium: false,
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return *its sum*.`,
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    examples: [
      {
        id: 'ex-007-1',
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        id: 'ex-007-2',
        input: 'nums = [1]',
        output: '1',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};`,
      python3: `from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}`,
      javascript: `var maxSubArray = function(nums) {\n};`,
      typescript: `function maxSubArray(nums: number[]): number {\n    return 0;\n}`,
      go: `func maxSubArray(nums []int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn max_sub_array(nums: Vec<i32>) -> i32 {\n        0\n    }\n}`,
      c: `int maxSubArray(int* nums, int numsSize) {\n    return 0;\n}`,
    },
    testCases: [
      { id: 'tc-007-1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { id: 'tc-007-2', input: '[1]', expectedOutput: '1' },
    ],
  },
  {
    id: 'prob-008',
    slug: 'climbing-stairs',
    number: 70,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    acceptanceRate: 51.9,
    totalSubmissions: 6234120,
    solvedCount: 3235529,
    isPremium: false,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: ['1 ≤ n ≤ 45'],
    examples: [
      {
        id: 'ex-008-1',
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1+1 and 2.',
      },
      {
        id: 'ex-008-2',
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.',
      },
    ],
    starterCode: {
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};`,
      python3: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}`,
      javascript: `var climbStairs = function(n) {\n};`,
      typescript: `function climbStairs(n: number): number {\n    return 0;\n}`,
      go: `func climbStairs(n int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn climb_stairs(n: i32) -> i32 {\n        0\n    }\n}`,
      c: `int climbStairs(int n) {\n    return 0;\n}`,
    },
    testCases: [
      { id: 'tc-008-1', input: '2', expectedOutput: '2' },
      { id: 'tc-008-2', input: '3', expectedOutput: '3' },
      { id: 'tc-008-3', input: '10', expectedOutput: '89' },
    ],
  },
  {
    id: 'prob-009',
    slug: 'binary-tree-inorder-traversal',
    number: 94,
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    tags: ['Stack', 'Tree', 'Depth-First Search', 'Binary Tree'],
    acceptanceRate: 73.1,
    totalSubmissions: 5823450,
    solvedCount: 4257122,
    isPremium: false,
    description: `Given the \`root\` of a binary tree, return *the inorder traversal of its nodes' values*.`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 ≤ Node.val ≤ 100',
    ],
    examples: [
      {
        id: 'ex-009-1',
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
      },
      {
        id: 'ex-009-2',
        input: 'root = []',
        output: '[]',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        return {};\n    }\n};`,
      python3: `from typing import Optional, List\n\nclass Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        return new ArrayList<>();\n    }\n}`,
      javascript: `var inorderTraversal = function(root) {\n    return [];\n};`,
      typescript: `function inorderTraversal(root: TreeNode | null): number[] {\n    return [];\n}`,
      go: `func inorderTraversal(root *TreeNode) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn inorder_traversal(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {\n        vec![]\n    }\n}`,
      c: `int* inorderTraversal(struct TreeNode* root, int* returnSize) {\n    return NULL;\n}`,
    },
    testCases: [
      { id: 'tc-009-1', input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
      { id: 'tc-009-2', input: '[]', expectedOutput: '[]' },
    ],
  },
  {
    id: 'prob-010',
    slug: 'reverse-linked-list',
    number: 206,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    acceptanceRate: 74.6,
    totalSubmissions: 6123450,
    solvedCount: 4568082,
    isPremium: false,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    examples: [
      {
        id: 'ex-010-1',
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        id: 'ex-010-2',
        input: 'head = [1,2]',
        output: '[2,1]',
      },
    ],
    starterCode: {
      cpp: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        return nullptr;\n    }\n};`,
      python3: `from typing import Optional\n\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        return null;\n    }\n}`,
      javascript: `var reverseList = function(head) {\n};`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {\n    return null;\n}`,
      go: `func reverseList(head *ListNode) *ListNode {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {\n        None\n    }\n}`,
      c: `struct ListNode* reverseList(struct ListNode* head) {\n    return NULL;\n}`,
    },
    testCases: [
      { id: 'tc-010-1', input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { id: 'tc-010-2', input: '[1,2]', expectedOutput: '[2,1]' },
    ],
  },
  {
    id: 'prob-011',
    slug: 'number-of-islands',
    number: 200,
    title: 'Number of Islands',
    difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    acceptanceRate: 57.3,
    totalSubmissions: 5234120,
    solvedCount: 2999110,
    isPremium: false,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 300',
      "grid[i][j] is '0' or '1'.",
    ],
    examples: [
      {
        id: 'ex-011-1',
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
      {
        id: 'ex-011-2',
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};`,
      python3: `from typing import List\n\nclass Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        pass`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}`,
      javascript: `var numIslands = function(grid) {\n};`,
      typescript: `function numIslands(grid: string[][]): number {\n    return 0;\n}`,
      go: `func numIslands(grid [][]byte) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn num_islands(grid: Vec<Vec<char>>) -> i32 {\n        0\n    }\n}`,
      c: `int numIslands(char** grid, int gridSize, int* gridColSize) {\n    return 0;\n}`,
    },
    testCases: [
      { id: 'tc-011-1', input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { id: 'tc-011-2', input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
    ],
  },
  {
    id: 'prob-012',
    slug: 'word-search',
    number: 79,
    title: 'Word Search',
    difficulty: 'Hard',
    tags: ['Array', 'Backtracking', 'Matrix'],
    acceptanceRate: 41.1,
    totalSubmissions: 4234120,
    solvedCount: 1740224,
    isPremium: false,
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` *if* \`word\` *exists in the grid*.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 ≤ m, n ≤ 6',
      '1 ≤ word.length ≤ 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    examples: [
      {
        id: 'ex-012-1',
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
      },
      {
        id: 'ex-012-2',
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
      },
    ],
    starterCode: {
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        return false;\n    }\n};`,
      python3: `from typing import List\n\nclass Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        pass`,
      java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        return false;\n    }\n}`,
      javascript: `var exist = function(board, word) {\n};`,
      typescript: `function exist(board: string[][], word: string): boolean {\n    return false;\n}`,
      go: `func exist(board [][]byte, word string) bool {\n    return false\n}`,
      rust: `impl Solution {\n    pub fn exist(board: Vec<Vec<char>>, word: String) -> bool {\n        false\n    }\n}`,
      c: `bool exist(char** board, int boardSize, int* boardColSize, char* word) {\n    return false;\n}`,
    },
    testCases: [
      { id: 'tc-012-1', input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"', expectedOutput: 'true' },
      { id: 'tc-012-2', input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"', expectedOutput: 'false' },
    ],
  },
  {
    id: 'prob-013',
    slug: 'container-with-most-water',
    number: 11,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'],
    acceptanceRate: 56.4,
    totalSubmissions: 7342100,
    solvedCount: 4145932,
    isPremium: false,
    description: `Given \`n\` non-negative integers \`height\` where each represents a point at coordinate \`(i, height[i])\`, find two lines that together with the x-axis form a container that holds the most water.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    examples: [
      { id: 'ex-013-1', input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { id: 'ex-013-2', input: 'height = [1,1]', output: '1' },
    ],
    starterCode: {
      cpp: `class Solution { public: int maxArea(vector<int>& height) { return 0; } };`,
      python3: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass`,
      java: `class Solution { public int maxArea(int[] height) { return 0; } }`,
      javascript: `var maxArea = function(height) { };`,
      typescript: `function maxArea(height: number[]): number { return 0; }`,
      go: `func maxArea(height []int) int { return 0 }`,
      rust: `impl Solution { pub fn max_area(height: Vec<i32>) -> i32 { 0 } }`,
      c: `int maxArea(int* height, int heightSize) { return 0; }`,
    },
    testCases: [
      { id: 'tc-013-1', input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { id: 'tc-013-2', input: '[1,1]', expectedOutput: '1' },
    ],
  },
  {
    id: 'prob-014',
    slug: 'best-time-to-buy-and-sell-stock',
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 55.1,
    totalSubmissions: 10243120,
    solvedCount: 5641922,
    isPremium: false,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day. Maximize your profit by choosing a single day to buy and a different day in the future to sell.`,
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    examples: [
      { id: 'ex-014-1', input: 'prices = [7,1,5,3,6,4]', output: '5' },
      { id: 'ex-014-2', input: 'prices = [7,6,4,3,1]', output: '0' },
    ],
    starterCode: {
      cpp: `class Solution { public: int maxProfit(vector<int>& prices) { return 0; } };`,
      python3: `class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass`,
      java: `class Solution { public int maxProfit(int[] prices) { return 0; } }`,
      javascript: `var maxProfit = function(prices) { };`,
      typescript: `function maxProfit(prices: number[]): number { return 0; }`,
      go: `func maxProfit(prices []int) int { return 0 }`,
      rust: `impl Solution { pub fn max_profit(prices: Vec<i32>) -> i32 { 0 } }`,
      c: `int maxProfit(int* prices, int pricesSize) { return 0; }`,
    },
    testCases: [
      { id: 'tc-014-1', input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { id: 'tc-014-2', input: '[7,6,4,3,1]', expectedOutput: '0' },
    ],
  },
  {
    id: 'prob-015',
    slug: 'min-stack',
    number: 155,
    title: 'Min Stack',
    difficulty: 'Medium',
    tags: ['Stack'],
    acceptanceRate: 53.0,
    totalSubmissions: 4932010,
    solvedCount: 2612965,
    isPremium: false,
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.`,
    constraints: [
      'Methods called up to 3 * 10^4 times',
      '-2^31 <= val <= 2^31 - 1',
    ],
    examples: [
      { id: 'ex-015-1', input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2' },
    ],
    starterCode: {
      cpp: `class MinStack { public: MinStack() {} void push(int val) {} void pop() {} int top() { return 0; } int getMin() { return 0; } };`,
      python3: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        return 0\n    def getMin(self) -> int:\n        return 0`,
      java: `class MinStack { public MinStack() {} public void push(int val) {} public void pop() {} public int top() { return 0; } public int getMin() { return 0; } }`,
      javascript: `var MinStack = function() {};`,
      typescript: `class MinStack { push(val: number): void {} pop(): void {} top(): number { return 0; } getMin(): number { return 0; } }`,
      go: `type MinStack struct {}\nfunc Constructor() MinStack { return MinStack{} }`,
      rust: `struct MinStack {}\nimpl MinStack { fn new() -> Self { Self {} } }`,
      c: `typedef struct { int _unused; } MinStack;`,
    },
    testCases: [
      { id: 'tc-015-1', input: 'ops=["MinStack","push","push","push","getMin","pop","top","getMin"], vals=[[],[-2],[0],[-3],[],[],[],[]]', expectedOutput: '[-3,0,-2]' },
    ],
  },
  {
    id: 'prob-016',
    slug: 'minimum-window-substring',
    number: 76,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 43.8,
    totalSubmissions: 6528910,
    solvedCount: 2859663,
    isPremium: false,
    description: `Given two strings \`s\` and \`t\`, return the minimum window substring of \`s\` such that every character in \`t\` is included in the window.`,
    constraints: [
      '1 <= s.length, t.length <= 10^5',
      's and t consist of English letters',
    ],
    examples: [
      { id: 'ex-016-1', input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { id: 'ex-016-2', input: 's = "a", t = "a"', output: '"a"' },
    ],
    starterCode: {
      cpp: `class Solution { public: string minWindow(string s, string t) { return ""; } };`,
      python3: `class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        return ""`,
      java: `class Solution { public String minWindow(String s, String t) { return ""; } }`,
      javascript: `var minWindow = function(s, t) { return ""; };`,
      typescript: `function minWindow(s: string, t: string): string { return ""; }`,
      go: `func minWindow(s string, t string) string { return "" }`,
      rust: `impl Solution { pub fn min_window(s: String, t: String) -> String { String::new() } }`,
      c: `char* minWindow(char* s, char* t) { return ""; }`,
    },
    testCases: [
      { id: 'tc-016-1', input: '"ADOBECODEBANC"\n"ABC"', expectedOutput: '"BANC"' },
      { id: 'tc-016-2', input: '"a"\n"a"', expectedOutput: '"a"' },
    ],
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-001',
    problemId: 'prob-001',
    language: 'python3',
    status: 'Accepted',
    runtime: '52 ms',
    memory: '16.4 MB',
    submittedAt: '2026-04-18T10:23:00Z',
  },
  {
    id: 'sub-002',
    problemId: 'prob-001',
    language: 'cpp',
    status: 'Wrong Answer',
    runtime: '8 ms',
    memory: '10.1 MB',
    submittedAt: '2026-04-18T09:51:00Z',
  },
  {
    id: 'sub-003',
    problemId: 'prob-003',
    language: 'javascript',
    status: 'Accepted',
    runtime: '76 ms',
    memory: '44.2 MB',
    submittedAt: '2026-04-17T22:14:00Z',
  },
  {
    id: 'sub-004',
    problemId: 'prob-005',
    language: 'python3',
    status: 'Runtime Error',
    runtime: 'N/A',
    memory: 'N/A',
    submittedAt: '2026-04-17T18:05:00Z',
  },
  {
    id: 'sub-005',
    problemId: 'prob-007',
    language: 'cpp',
    status: 'Accepted',
    runtime: '4 ms',
    memory: '8.8 MB',
    submittedAt: '2026-04-16T14:30:00Z',
  },
];

export const SOLVED_PROBLEM_IDS = ['prob-001', 'prob-003', 'prob-007'];

export const ALL_TAGS = [
  'Array', 'Hash Table', 'String', 'Linked List', 'Math',
  'Dynamic Programming', 'Tree', 'Stack', 'Graph', 'Binary Search',
  'Two Pointers',
  'Sliding Window', 'Recursion', 'Backtracking', 'Matrix',
  'Depth-First Search', 'Breadth-First Search', 'Union Find',
  'Divide and Conquer', 'Memoization',
];