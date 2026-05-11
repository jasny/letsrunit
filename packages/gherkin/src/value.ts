import { isArray, isString, parseDateString, type FileValue, type Scalar } from '@letsrunit/utils';
import { createHmac } from 'node:crypto';

export const scalarRegexp =
  /password of "((?:[^"\\]+|\\.)*)"|"((?:[^"\\]+|\\.)*)"|(-?\d+(?:\.\d+)?)|date (?:of )?((?:today|tomorrow|yesterday|\d+ \w+ (?:ago|from now))(?: (?:at )?\d\d?:\d\d?(?::\d\d?)?)?|"\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:.\d{3})?Z?)?")/;
export const arrayRegexp = new RegExp(String.raw`\[(.*?)\]`);
export const fileRegexp =
  /file (?:"((?:[^"\\]+|\\.)*)"|\[((?:"(?:[^"\\]+|\\.)*"(?:,\s*)?)*)\])/;

function requirePasswordSeed(): string {
  const seed = process.env.LETSRUNIT_PASSWORD_SEED?.trim();
  if (!seed) {
    throw new Error('LETSRUNIT_PASSWORD_SEED is required to use password values (password of "...").');
  }

  return seed;
}

function buildPassword(input: string): string {
  const digest = createHmac('sha256', requirePasswordSeed()).update(input).digest('hex');
  return `Lr!${digest.slice(0, 18)}a1`;
}

function transformScalar(password?: string, str?: string, num?: string, date?: string): Scalar {
  if (password != null) return buildPassword(password);
  if (str != null) return str;
  if (num != null) return Number(num);
  if (date) return parseDateString(date);

  throw new Error('Unexpected value');
}

function parseQuotedStrings(value: string): string[] {
  const matches = Array.from(value.matchAll(/"((?:[^"\\]+|\\.)*)"/g), (match) => match[1]);

  if (!isArray(matches, isString) || matches.length === 0) {
    throw new Error('Expected one or more quoted file paths');
  }

  return matches;
}

function buildFileValue(singlePath?: string, multiplePaths?: string): FileValue {
  return {
    kind: 'file',
    paths: singlePath != null ? [singlePath] : parseQuotedStrings(multiplePaths ?? ''),
  };
}

export const valueTransformer = (
  file?: string,
  files?: string,
  password?: string,
  str?: string,
  num?: string,
  date?: string,
  arr?: string,
): Scalar | Scalar[] | FileValue => {
  if (file != null || files != null) return buildFileValue(file, files);

  return arr
    ? Array.from(arr.matchAll(new RegExp(scalarRegexp, 'g')), (m) => transformScalar(m[1], m[2], m[3], m[4]))
    : transformScalar(password, str, num, date);
};
