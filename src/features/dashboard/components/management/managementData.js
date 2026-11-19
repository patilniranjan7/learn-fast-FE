export const percentage = (score, maxScore) =>
  maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

export const averageScore = (attempts) =>
  attempts.length
    ? Math.round(
        attempts.reduce(
          (total, attempt) => total + percentage(attempt.score, attempt.maxScore),
          0,
        ) / attempts.length,
      )
    : null;

export function cohortEvidence(data, cohort) {
  const tests = data.tests.filter(
    (test) => test.cohortId === cohort.id && test.cohortKind === cohort.kind,
  );
  const testIds = new Set(tests.map((test) => test.id));
  const attempts = data.attempts.filter((attempt) => testIds.has(attempt.testId));
  const evaluated = attempts.filter((attempt) => attempt.status === 'Evaluated');
  return { tests, attempts, evaluated, average: averageScore(evaluated) };
}

export function testScorePoints(tests, attempts) {
  return tests
    .map((test) => {
      const evaluated = attempts.filter(
        (attempt) => attempt.testId === test.id && attempt.status === 'Evaluated',
      );
      return {
        id: test.id,
        label: test.title,
        date: test.date,
        score: averageScore(evaluated),
        count: evaluated.length,
      };
    })
    .filter((point) => point.score !== null)
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function formatDate(value) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`));
}
