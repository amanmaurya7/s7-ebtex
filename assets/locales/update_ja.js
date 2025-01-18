import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import en from './en.js';
import ja from './ja.js';

// Helper to get the current directory in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to flatten a nested object
function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

// Flatten `en.js` as the template
const flattenedEn = flattenObject(en);

// Flatten `ja.js` to retrieve its values
const flattenedJa = flattenObject(ja);

// Combine `en.js` keys with values from `ja.js` (or fallback to `en.js` values)
const mergedTranslations = {};
for (const key in flattenedEn) {
  mergedTranslations[key] = flattenedJa[key] || flattenedEn[key];
}

// Convert the merged object to a JS module with single quotes
function toJsModule(obj) {
  const jsonString = JSON.stringify(obj, null, 2)
    .replace(/"(\w+)"\s*:/g, '$1:')      // Unquote keys
    .replace(/"/g, "'");                  // Use single quotes
  return `export default ${jsonString};`;
}

// Output the combined result to `ja_flatten.js`
const outputFilePath = path.join(__dirname, 'ja_flatten.js');
fs.writeFileSync(outputFilePath, toJsModule(mergedTranslations), 'utf8');

console.log(`Merged translation has been saved to ${outputFilePath}`);

