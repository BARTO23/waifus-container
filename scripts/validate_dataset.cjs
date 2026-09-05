const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'red_waifus.json');

if (!fs.existsSync(dataPath)) {
  console.error(`Error: Dataset file not found at ${dataPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(dataPath, 'utf-8');
let data;

try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Error: Failed to parse JSON:', e.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('Error: Dataset must be an array of records');
  process.exit(1);
}

console.log(`Checking dataset: found ${data.length} records.`);

if (data.length < 400) {
  console.error(`Error: Expected at least 400 records, got ${data.length}`);
  process.exit(1);
}

const idSet = new Set();
const origins = { manga: 0, manhwa: 0, manhua: 0 };
const errors = [];

data.forEach((item, index) => {
  const prefix = `Record [${index}] (id: ${item.id || 'missing'})`;

  // Check essential fields
  if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
    errors.push(`${prefix}: missing or invalid 'id'`);
  } else if (idSet.has(item.id)) {
    errors.push(`${prefix}: duplicate id '${item.id}'`);
  } else {
    idSet.add(item.id);
  }

  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    errors.push(`${prefix}: missing or invalid 'name'`);
  }

  if (!item.origin || !['manga', 'manhwa', 'manhua'].includes(item.origin)) {
    errors.push(`${prefix}: invalid 'origin' '${item.origin}', expected manga, manhwa, or manhua`);
  } else {
    origins[item.origin]++;
  }

  if (!item.series || typeof item.series !== 'string' || item.series.trim() === '') {
    errors.push(`${prefix}: missing or invalid 'series'`);
  }

  if (!item.description || typeof item.description !== 'string' || item.description.trim() === '') {
    errors.push(`${prefix}: missing or invalid 'description'`);
  }

  if (!Array.isArray(item.tags) || item.tags.length === 0 || !item.tags.every(t => typeof t === 'string' && t.trim() !== '')) {
    errors.push(`${prefix}: 'tags' must be a non-empty array of strings`);
  }

  if (!item.image || typeof item.image !== 'string' || !item.image.startsWith('http')) {
    errors.push(`${prefix}: missing or invalid 'image' URL`);
  }
});

if (origins.manga === 0 || origins.manhwa === 0 || origins.manhua === 0) {
  errors.push(`Error: Missing representation for one or more origins: ${JSON.stringify(origins)}`);
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} errors:`);
  errors.slice(0, 10).forEach(e => console.error(' -', e));
  if (errors.length > 10) console.error(` ... and ${errors.length - 10} more errors.`);
  process.exit(1);
}

console.log('✅ Validation successful!');
console.log(`Total count: ${data.length} (>= 400)`);
console.log(`Origins breakdown: Manga: ${origins.manga}, Manhwa: ${origins.manhwa}, Manhua: ${origins.manhua}`);
console.log('All IDs unique, all essential fields present and non-empty, all images valid URLs.');
