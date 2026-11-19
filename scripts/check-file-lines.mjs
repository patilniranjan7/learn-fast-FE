import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const maxLines = 300;
const root = path.resolve(process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url)));
const excludedDirectories = new Set([
  'node_modules',
  'dist',
  'coverage',
  '.git',
  '.vite',
  'generated',
  '__generated__',
]);
const excludedFiles = new Set(['package-lock.json', 'npm-shrinkwrap.json']);
const extensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.css', '.scss', '.html', '.json']);

async function findFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const location = path.join(directory, entry.name);

    if (entry.isDirectory() && !excludedDirectories.has(entry.name)) {
      files.push(...(await findFiles(location)));
    } else if (
      entry.isFile() &&
      !excludedFiles.has(entry.name) &&
      extensions.has(path.extname(entry.name))
    ) {
      files.push(location);
    }
  }

  return files;
}

const files = await findFiles(root);
const violations = [];

for (const file of files.sort()) {
  const content = (await readFile(file, 'utf8')).replace(/\r\n?/g, '\n');
  const count = content === '' ? 0 : content.split('\n').length - Number(content.endsWith('\n'));

  if (count > maxLines) {
    violations.push(`${path.relative(root, file)}: ${count} lines (max ${maxLines})`);
  }
}

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`File size check passed: ${files.length} files, max ${maxLines} lines each.`);
}
