const FIRST_TIME_REGEX = /\b(?:first|1st)(?:\s|-)*time(?:\s+(?:home\s*)?buyer|\s+homeowner)?\b/;
const NEGATION_TOKENS = [
  'not',
  "don't",
  'dont',
  "didn't",
  'didnt',
  'no',
  'never',
  "isn't",
  'isnt',
  "aren't",
  'arent',
  "ain't",
  'aint',
  'without',
];
const AFFIRMATIVE_TOKENS = [
  'yes',
  'yeah',
  'yep',
  'yup',
  'sure',
  'correct',
  'true',
  'absolutely',
  'indeed',
  'definitely',
  'affirmative',
];

const NEGATION_REGEX = new RegExp(`\\b(?:${NEGATION_TOKENS.join('|')})\\b`);
const AFFIRMATIVE_REGEX = new RegExp(`\\b(?:${AFFIRMATIVE_TOKENS.join('|')})\\b`);
const PRONOUN_REGEX = /\b(?:i\s*(?:am|'m)|we\s*(?:are|'re)|this\s+is\s+my|it's\s+my|its\s+my)\b/;
const DECLARATIVE_REGEX = /\bfirst(?:\s|-)*time\s+buyer(?:\s+here)?\b/;

export function parseFirstTimeBuyer(message: string): boolean | undefined {
  if (!message) {
    return undefined;
  }

  const lower = message.toLowerCase();

  if (!FIRST_TIME_REGEX.test(lower)) {
    return undefined;
  }

  const segments = (lower.match(/[^.!?]+[.!?]?/g) || [])
    .map((segment) => segment.trim())
    .filter(Boolean);

  const relevantSegments = segments.length > 0
    ? segments.filter((segment) => FIRST_TIME_REGEX.test(segment))
    : [lower];

  if (relevantSegments.length === 0) {
    return undefined;
  }

  const hasNegation = relevantSegments.some((segment) => {
    if (!NEGATION_REGEX.test(segment)) {
      return /\b(?:not|no)\b[^.]*\b(?:first|1st)\b/.test(segment) ||
             /\b(?:first|1st)\b[^.]*\b(?:not|no)\b/.test(segment);
    }
    return true;
  });

  if (hasNegation) {
    return false;
  }

  const hasAffirmation = relevantSegments.some((segment) => {
    const isQuestion = segment.endsWith('?');

    if (AFFIRMATIVE_REGEX.test(segment) || PRONOUN_REGEX.test(segment)) {
      return true;
    }

    return !isQuestion && DECLARATIVE_REGEX.test(segment);
  });

  if (hasAffirmation) {
    return true;
  }

  const endsWithQuestion = relevantSegments.every((segment) => segment.endsWith('?'));

  return endsWithQuestion ? undefined : true;
}
