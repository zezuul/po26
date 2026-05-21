'use strict';

/**
 * Bezpieczne scalanie — tylko własne klucze źródła (bez __proto__ / prototype pollution).
 * Poprawka po analizie CodeQL (zadanie 6).
 */
function safeMerge(target, source) {
  if (source === null || typeof source !== 'object') {
    return target;
  }

  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = safeMerge(
          typeof output[key] === 'object' && output[key] !== null ? output[key] : {},
          value,
        );
      } else {
        output[key] = value;
      }
    }
  }

  return output;
}

module.exports = { safeMerge };
