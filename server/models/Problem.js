const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expected_output: { type: String, required: true },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    problemKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    input_format: { type: String, default: '' },
    output_format: { type: String, default: '' },
    test_cases: { type: [testCaseSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
