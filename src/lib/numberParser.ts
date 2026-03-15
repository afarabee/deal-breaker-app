const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
};

const MAGNITUDES: Record<string, number> = {
  hundred: 100, thousand: 1000, million: 1000000,
};

const STRIP_WORDS = new Set(["dollars", "dollar", "percent", "bucks", "and", "a"]);

/**
 * Parse spoken text into a numeric string.
 * Examples:
 *   "twenty-five thousand" → "25000"
 *   "five point nine" → "5.9"
 *   "ninety seven thousand seventy four" → "97074"
 *   "12500" → "12500"
 *   "five nine" (percentage context) → "5.9"
 */
export function parseSpokenNumber(text: string, isPercentage = false): string {
  if (!text) return "";

  const cleaned = text.toLowerCase().trim();

  // If it's already a plain number, return it
  const plainNum = cleaned.replace(/[,$%\s]/g, "");
  if (/^\d+\.?\d*$/.test(plainNum)) {
    return plainNum;
  }

  // Tokenize: split hyphens, spaces
  const tokens = cleaned
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((t) => !STRIP_WORDS.has(t));

  // Check for "point" / "dot" for decimals
  const pointIndex = tokens.indexOf("point") !== -1 ? tokens.indexOf("point") : tokens.indexOf("dot");

  let integerTokens = pointIndex >= 0 ? tokens.slice(0, pointIndex) : tokens;
  let decimalTokens = pointIndex >= 0 ? tokens.slice(pointIndex + 1) : [];

  const intPart = parseIntegerTokens(integerTokens);
  
  // For percentages with two single-digit words and no magnitude words, treat as "X.Y"
  // e.g., "five nine" → 5.9
  if (
    isPercentage &&
    decimalTokens.length === 0 &&
    integerTokens.length === 2 &&
    !integerTokens.some((t) => t in MAGNITUDES || t in TENS)
  ) {
    const a = wordToDigit(integerTokens[0]);
    const b = wordToDigit(integerTokens[1]);
    if (a !== null && b !== null) {
      return `${a}.${b}`;
    }
  }

  if (intPart === null && decimalTokens.length === 0) return "";

  let result = intPart !== null ? String(intPart) : "0";

  if (decimalTokens.length > 0) {
    // Decimal digits: each word becomes a single digit
    const decDigits = decimalTokens.map(wordToDigit).filter((d) => d !== null);
    if (decDigits.length > 0) {
      result += "." + decDigits.join("");
    }
  }

  return result;
}

function wordToDigit(word: string): number | null {
  if (word in ONES) return ONES[word];
  const n = parseInt(word, 10);
  return isNaN(n) ? null : n;
}

function parseIntegerTokens(tokens: string[]): number | null {
  if (tokens.length === 0) return null;

  // Try parsing as raw digits joined
  const joined = tokens.join("");
  if (/^\d+$/.test(joined)) return parseInt(joined, 10);

  let total = 0;
  let current = 0;

  for (const token of tokens) {
    if (token in ONES) {
      current += ONES[token];
    } else if (token in TENS) {
      current += TENS[token];
    } else if (token === "hundred") {
      current = (current === 0 ? 1 : current) * 100;
    } else if (token === "thousand") {
      current = (current === 0 ? 1 : current) * 1000;
      total += current;
      current = 0;
    } else if (token === "million") {
      current = (current === 0 ? 1 : current) * 1000000;
      total += current;
      current = 0;
    } else {
      // Try as raw number
      const n = parseInt(token, 10);
      if (!isNaN(n)) current += n;
    }
  }

  total += current;
  return total === 0 && !tokens.some((t) => t === "zero") ? null : total;
}
