const fs = require('fs');
const path = require('path');
const Problem = require('../models/Problem');

const seedPath = path.join(__dirname, '..', 'data', 'problems.seed.json');

async function seedProblems() {
  if (!fs.existsSync(seedPath)) {
    return;
  }

  const raw = fs.readFileSync(seedPath, 'utf-8');
  const problems = JSON.parse(raw);

  const upserts = problems.map((problem) =>
    Problem.updateOne(
      { problemKey: problem.problemKey },
      {
        $setOnInsert: {
          slug: problem.slug || problem.problemKey,
          title: problem.title,
          description: problem.description,
          input_format: problem.input_format || '',
          output_format: problem.output_format || '',
          test_cases: problem.test_cases || [],
        },
      },
      { upsert: true },
    ),
  );

  await Promise.all(upserts);
  console.log(`Seeded problem records: ${problems.length}`);
}

module.exports = {
  seedProblems,
};
