const express = require('express');
const fs = require('fs');
const path = require('path');
const { getLanguage, getLanguageColor } = require('./lib/language-map');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const SRC_DIR = path.join(__dirname, 'src');
const REPO_NAME = 'sharecode';
const GITHUB_USERNAME = 'danz-my';

function getAllFiles() {
  try {
    if (!fs.existsSync(SRC_DIR)) {
      return [];
    }

    const items = fs.readdirSync(SRC_DIR);
    const files = [];

    for (const item of items) {
      const fullPath = path.join(SRC_DIR, item);
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && !item.startsWith('.')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lang = getLanguage(item);
        const color = getLanguageColor(lang);
        const lines = content.split('\n').length;

        files.push({
          name: item,
          language: lang,
          color: color,
          size: stat.size,
          lines: lines,
          modified: stat.mtime.toISOString(),
          path: item,
        });
      }
    }

    files.sort((a, b) => a.name.localeCompare(b.name));
    return files;
  } catch (err) {
    console.error('Error reading src folder:', err.message);
    return [];
  }
}

function getFileContent(filename) {
  try {
    if (!filename || filename.includes('..')) {
      return null;
    }

    const fullPath = path.join(SRC_DIR, filename);
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(path.resolve(SRC_DIR))) {
      return null;
    }

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return null;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lang = getLanguage(filename);
    const color = getLanguageColor(lang);
    const lines = content.split('\n').length;
    const stat = fs.statSync(fullPath);

    return {
      filename: filename,
      content: content,
      language: lang,
      color: color,
      lines: lines,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

app.get('/api/files', (req, res) => {
  const files = getAllFiles();
  res.json({
    success: true,
    repo: REPO_NAME,
    username: GITHUB_USERNAME,
    total: files.length,
    files: files,
  });
});

app.get('/api/files/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const file = getFileContent(filename);

  if (!file) {
    return res.status(404).json({
      success: false,
      error: 'File tidak ditemukan',
    });
  }

  res.json({
    success: true,
    file: file,
  });
});

app.get('/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const file = getFileContent(filename);

  if (!file) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║        ShareCode Server v2.0         ║');
  console.log('  ║  ────────────────────────────────    ║');
  console.log(`  ║  Local : http://localhost:${PORT}        ║`);
  console.log(`  ║  Repo  : ${GITHUB_USERNAME}/${REPO_NAME}              ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  const files = getAllFiles();
  if (files.length > 0) {
    console.log(`  ${files.length} file tersedia di src/ :`);
    console.log('');
    files.forEach(f => {
      const sizeKB = (f.size / 1024).toFixed(1);
      console.log(`  ${sizeKB.padStart(6)} KB  |  ${f.language.padEnd(14)} |  ${f.name}`);
    });
    console.log('');
  } else {
    console.log('  Belum ada file di folder src/');
    console.log('');
  }
});