const mongoose = require('mongoose');

const submissionTestResultSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expected_output: { type: String, required: true },
    actual_output: { type: String, default: '' },
    passed: { type: Boolean, default: false },
    runtime: { type: String, default: null },
  },
  { _id: false },
);

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language_id: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    },
    stdout: { type: String, default: null },
    stderr: { type: String, default: null },
    compile_output: { type: String, default: null },
    testResults: { type: [submissionTestResultSchema], default: [] },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
