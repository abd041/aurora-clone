'use client';

import SplitText from '@/lib/SplitText';

/**
 * Line split with optional overflow wrappers (original LineByLine).
 */
export function splitIntoLines(element, options = {}) {
  const {
    linesClass = 'split',
    parentClass = 'split-parent',
    wrapOverflow = true,
  } = options;

  const primary = new SplitText(element, { type: 'lines', linesClass });
  let parentSplit = null;

  if (wrapOverflow) {
    parentSplit = new SplitText(element, { type: 'lines', linesClass: parentClass });
  }

  return {
    lines: primary.lines,
    words: primary.words,
    chars: primary.chars,
    revert() {
      parentSplit?.revert();
      primary.revert();
    },
  };
}

export function splitIntoWords(element, className = 'split') {
  const split = new SplitText(element, { type: 'words', wordsClass: className });
  return {
    words: split.words,
    revert() {
      split.revert();
    },
  };
}

export function splitIntoChars(element, className = 'split') {
  const split = new SplitText(element, { type: 'chars', charsClass: className });
  return {
    chars: split.chars,
    revert() {
      split.revert();
    },
  };
}

/**
 * Generic split matching RevealLines (`type: 'lines' | 'words' | 'chars'`).
 */
export function splitByType(element, type = 'chars', options = {}) {
  const split = new SplitText(element, { type, ...options });
  return {
    lines: split.lines,
    words: split.words,
    chars: split.chars,
    revert() {
      split.revert();
    },
  };
}
