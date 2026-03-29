import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const guidePath = resolve(process.cwd(), 'lib/content/career-guide.ts');
const guideSource = readFileSync(guidePath, 'utf8');

function fail(message) {
  console.error(`content freshness check failed: ${message}`);
  process.exit(1);
}

const reviewedMatch = guideSource.match(
  /export const CONTENT_LAST_REVIEWED = '([^']+)'/
);
const maxAgeMatch = guideSource.match(
  /export const CONTENT_REVIEW_MAX_AGE_DAYS = (\d+)/
);

if (!reviewedMatch) {
  fail('CONTENT_LAST_REVIEWED not found in lib/content/career-guide.ts');
}

if (!maxAgeMatch) {
  fail('CONTENT_REVIEW_MAX_AGE_DAYS not found in lib/content/career-guide.ts');
}

const reviewedAt = new Date(`${reviewedMatch[1]}T00:00:00Z`);
const maxAgeDays = Number(maxAgeMatch[1]);

if (Number.isNaN(reviewedAt.getTime())) {
  fail(`invalid CONTENT_LAST_REVIEWED value "${reviewedMatch[1]}"`);
}

if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
  fail(`invalid CONTENT_REVIEW_MAX_AGE_DAYS value "${maxAgeMatch[1]}"`);
}

const ageDays = Math.floor((Date.now() - reviewedAt.getTime()) / MS_PER_DAY);

if (ageDays > maxAgeDays) {
  fail(`content review is ${ageDays} days old; maximum allowed is ${maxAgeDays} days`);
}

console.log(
  `content freshness ok: ${ageDays} day(s) since last review, within ${maxAgeDays}-day limit`
);
