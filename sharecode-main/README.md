# ShareCode

A minimal self-hosted platform for sharing code snippets. Drop files into the `src/` folder and they instantly become shareable, syntax-highlighted pages with permanent links.

Built with Node.js and Express. No database required.

---

## Features

- Automatic syntax highlighting for 30+ languages
- Live file detection — no restart needed when adding files
- Instant shareable links for every file
- One-click copy for code and share URLs
- Client-side search with no page reload
- Path traversal protection on the file API
- Zero config beyond dropping files into `src/`

---

## Project Structure

```
sharecode/
├── src/                  # Put your code files here
│   ├── example.js
│   └── ...
├── public/
│   └── index.html        # Frontend (single file, no build step)
├── lib/
│   └── language-map.js   # Extension → language mapping
├── server.js             # Express server + REST API
└── package.json
```

---

## Getting Started

**Requirements:** Node.js 16 or later

```bash
# Clone the repository
git clone https://github.com/danz-my/sharecode.git
cd sharecode

# Install dependencies
npm install

# Start the server
npm start
```

The server runs on `http://localhost:3000` by default.

To change the port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

---

## Adding Files

Place any code file inside the `src/` folder:

```bash
cp my-script.py src/
```

It will appear on the dashboard immediately. No restart required. Files are served at:

```
http://localhost:3000/my-script.py
```

---

## API

The server exposes a simple REST API used by the frontend.

**List all files**

```
GET /api/files
```

```json
{
  "success": true,
  "total": 4,
  "files": [
    {
      "name": "example.js",
      "language": "javascript",
      "size": 1024,
      "lines": 42,
      "modified": "2026-05-02T10:00:00.000Z"
    }
  ]
}
```

**Get a single file**

```
GET /api/files/:filename
```

```json
{
  "success": true,
  "file": {
    "filename": "example.js",
    "content": "...",
    "language": "javascript",
    "lines": 42,
    "size": 1024,
    "modified": "2026-05-02T10:00:00.000Z"
  }
}
```

---

## Supported Languages

JavaScript, TypeScript, JSX/TSX, Python, Java, C, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, Bash, PowerShell, HTML, CSS, SCSS, JSON, YAML, TOML, Markdown, XML, Lua, Dart, Dockerfile, GraphQL, and more.

Language detection is based on file extension via `lib/language-map.js`.

---

## Security

- All file requests are validated against the resolved `src/` directory path
- Path traversal attempts (`../`) are rejected before reaching the filesystem
- Only files directly inside `src/` (no subdirectories) are served
- Hidden files (dot-prefixed) are excluded

---

## Customization

Open `public/index.html` and edit the constants at the top of the script block:

```js
const GITHUB_USERNAME = 'danz-my';
const REPO_NAME       = 'sharecode';
const CONTACT = {
  email:    'support@gmail.com',
  telegram: '@hookrest',
  whatsapp: '62895323195263',
};
```

---

## License

MIT
