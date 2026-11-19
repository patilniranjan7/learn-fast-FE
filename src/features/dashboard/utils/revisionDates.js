export function localDate(value = new Date()) {
  const date = new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function parseDate(value) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value, options = {}) {
  return parseDate(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function shiftMonth(value, amount) {
  const date = parseDate(value);
  return localDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
}

export function monthDays(value) {
  const date = parseDate(value);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) =>
    localDate(new Date(date.getFullYear(), date.getMonth(), index - offset + 1)),
  );
}

export function validateRevision(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Give your revision a title.';
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ||
    Number.isNaN(parseDate(values.date).getTime()) ||
    localDate(parseDate(values.date)) !== values.date
  ) {
    errors.date = 'Choose a revision date.';
  }
  return errors;
}
