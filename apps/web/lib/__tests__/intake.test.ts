import { parseFirstTimeBuyer } from '../intake';

function assertEqual(actual: unknown, expected: unknown, description: string) {
  if (actual !== expected) {
    throw new Error(`${description} - expected ${expected}, received ${actual}`);
  }
}

function assertUndefined(value: unknown, description: string) {
  if (value !== undefined) {
    throw new Error(`${description} - expected undefined, received ${value}`);
  }
}

(function runTests() {
  assertEqual(parseFirstTimeBuyer('I am a first time buyer.'), true, 'Affirmative statement should return true');
  assertEqual(parseFirstTimeBuyer('Yes, first-time buyer here!'), true, 'Affirmation with punctuation should return true');
  assertEqual(parseFirstTimeBuyer("It's my first time buying a home."), true, 'Indirect confirmation should return true');

  assertEqual(parseFirstTimeBuyer('I am not a first time buyer.'), false, 'Negated statement should return false');
  assertEqual(parseFirstTimeBuyer('No, not a first-time buyer.'), false, 'Explicit negative response should return false');

  assertUndefined(
    parseFirstTimeBuyer('What qualifies someone as a first time buyer?'),
    'Clarifying question should not set status',
  );
  assertUndefined(parseFirstTimeBuyer('Tell me about mortgage options.'), 'Unrelated message should not set status');

  console.log('parseFirstTimeBuyer tests passed');
})();
