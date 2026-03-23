/**
 * fix-imports.js
 * 
 * Scans your entire src/ folder, finds all import/require paths,
 * and corrects casing mismatches against the real filesystem.
 * 
 * Usage:
 *   node fix-imports.js          → preview fixes (dry run)
 *   node fix-imports.js --fix    → apply fixes
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--fix');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, 'src');   // change if your source root differs
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'];
const IMPORT_REGEX = /(?:import\s+(?:[\s\S]*?\s+from\s+)?|require\s*\(\s*)['"]([^'"]+)['"]/g;
// ─────────────────────────────────────────────────────────────────────────────

let totalFiles = 0;
let totalFixed = 0;
let totalErrors = 0;

/** Walk a directory recursively, yield file paths */
function* walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      yield* walkDir(full);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      yield full;
    }
  }
}

/**
 * Given a resolved absolute path that MIGHT have wrong casing,
 * walk each segment of the path and find the real casing on disk.
 * Returns the correctly-cased absolute path, or null if not found.
 */
function getRealPath(absPath) {
  const parts = absPath.split(path.sep);
  let current = parts[0] + path.sep; // e.g. "D:\" or "/"

  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    try {
      const entries = fs.readdirSync(current);
      const match = entries.find(e => e.toLowerCase() === parts[i].toLowerCase());
      if (!match) return null;
      current = path.join(current, match);
    } catch {
      return null;
    }
  }
  return current;
}

/**
 * Given the file doing the import and the raw import specifier,
 * return the corrected specifier if casing is wrong, else null.
 */
function getFixedSpecifier(sourceFile, specifier) {
  // Skip: node_modules, URLs, bare specifiers without a path
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) return null;
  if (specifier.startsWith('http')) return null;

  const sourceDir = path.dirname(sourceFile);
  const resolved = path.resolve(sourceDir, specifier);

  // Try exact first
  if (fs.existsSync(resolved)) return null;

  // Try with common extensions appended
  const candidates = [
    resolved,
    ...EXTENSIONS.map(ext => resolved + ext),
    ...EXTENSIONS.map(ext => path.join(resolved, 'index' + ext)),
  ];

  for (const candidate of candidates) {
    const real = getRealPath(candidate);
    if (!real) continue;

    // Strip any extension we added during probing
    let realRelative = path.relative(sourceDir, real);

    // Normalise to forward slashes
    realRelative = realRelative.replace(/\\/g, '/');
    if (!realRelative.startsWith('.')) realRelative = './' + realRelative;

    // Remove extension if the original specifier had none
    if (!path.extname(specifier)) {
      const ext = path.extname(realRelative);
      if (ext) realRelative = realRelative.slice(0, -ext.length);
      // Also remove /index suffix if original had none
      if (realRelative.endsWith('/index')) {
        realRelative = realRelative.slice(0, -6) || './';
      }
    }

    if (realRelative !== specifier) return realRelative;
    return null; // casing already correct
  }

  return null; // file not found – leave as is (may be intentional alias)
}

/** Process a single file */
function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`  ✗ Cannot read: ${filePath}`);
    totalErrors++;
    return;
  }

  const fixes = [];
  let match;
  IMPORT_REGEX.lastIndex = 0;

  while ((match = IMPORT_REGEX.exec(content)) !== null) {
    const specifier = match[1];
    const fixed = getFixedSpecifier(filePath, specifier);
    if (fixed) {
      fixes.push({ original: specifier, fixed });
    }
  }

  if (fixes.length === 0) return;

  const relPath = path.relative(process.cwd(), filePath);
  console.log(`\n📄 ${relPath}`);

  let newContent = content;
  for (const { original, fixed } of fixes) {
    console.log(`   ✗ "${original}"`);
    console.log(`   ✓ "${fixed}"`);
    // Replace all occurrences in this file
    newContent = newContent.split(`'${original}'`).join(`'${fixed}'`);
    newContent = newContent.split(`"${original}"`).join(`"${fixed}"`);
    totalFixed++;
  }

  if (!DRY_RUN) {
    try {
      fs.writeFileSync(filePath, newContent, 'utf8');
    } catch (e) {
      console.error(`  ✗ Cannot write: ${filePath}`);
      totalErrors++;
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════');
console.log('  Import Casing Fixer for Netlify / Linux builds   ');
console.log('═══════════════════════════════════════════════════');
console.log(`Mode : ${DRY_RUN ? '🔍 DRY RUN (no files changed)' : '✏️  FIX MODE (files will be updated)'}`);
console.log(`Root : ${ROOT}`);
console.log('───────────────────────────────────────────────────\n');

if (!fs.existsSync(ROOT)) {
  console.error(`❌ Source root not found: ${ROOT}`);
  console.error('   Edit the ROOT constant at the top of this script.');
  process.exit(1);
}

for (const file of walkDir(ROOT)) {
  totalFiles++;
  processFile(file);
}

console.log('\n───────────────────────────────────────────────────');
console.log(`Files scanned : ${totalFiles}`);
console.log(`Fixes found   : ${totalFixed}`);
if (totalErrors) console.log(`Errors        : ${totalErrors}`);
console.log('───────────────────────────────────────────────────');

if (DRY_RUN && totalFixed > 0) {
  console.log('\n👆 Run with --fix to apply all changes:');
  console.log('   node fix-imports.js --fix\n');
} else if (!DRY_RUN && totalFixed > 0) {
  console.log('\n✅ All fixes applied! Commit and redeploy on Netlify.\n');
} else {
  console.log('\n✅ No casing issues found!\n');
}