<div align="center">

# 🔍 Diryzer

A sleek command-line tool for analyzing directory contents with visual file type distribution.

[![npm version](https://img.shields.io/npm/v/diryzer.svg)](https://www.npmjs.com/package/diryzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ Features

- 📊 Visual progress bar showing file type distribution
- 🎨 Color-coded output for different file types
- 🔄 Customizable directory depth scanning
- 🚫 Pattern-based directory exclusion
- 📈 Optional percentage display

## 🚀 Installation

```bash
npm install -g diryzer
```

## 💻 Usage

### Basic Command

```bash
diryzer <directory>
```

### Options

```bash
Options:
  -V, --version              output the version number
  -e, --exclude <patterns>   patterns to exclude from analysis
  -d, --depth <number>      depth of subdirectories to analyze (default: "5")
  -p, --percentage          show file distribution as percentages
  -h, --help               display help for command
```

### 📝 Examples

Analyze current directory:
```bash
diryzer .
```

Exclude specific directories:
```bash
diryzer --exclude 'node_modules/**' '.git' .
```

Set scan depth and show percentages:
```bash
diryzer --depth 3 --percentage .
```

## 🖥️ Example Output

```
Total Files: 42
Total File Types: 5

[=================== ]
.ts     :15  (35.71%)
.js     :10  (23.81%)
.json   :8   (19.05%)
.md     :5   (11.90%)
.txt    :4   (9.52%)
```

## 🔧 Programmatic Usage
### Installation for Developer Projects

To install `diryzer` as a development dependency in your project, run:

```bash
npm install diryzer --save-dev
```

You can then use it in your project scripts or directly in your code.
```typescript
import { DirectoryAnalyzer } from 'diryzer';

const analyzer = new DirectoryAnalyzer({
  directoryPath: './my-project',
  depth: 5,
  excludePatterns: ['node_modules/**']
});

const result = analyzer.analyze();
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Node.js
- Uses Commander.js for CLI interface
- Chalk for colorful terminal output

---

<div align="center">
Made with ❤️ by developers for developers
</div>
