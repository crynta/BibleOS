<div align="center">
  <img src="public/BibleOS-app-logo.png" alt="BibleOS Logo" width="120" height="120" />
  <h1>Bible OS</h1>
  <p><strong>A beautiful, lightweight Bible reader app with integrated AI chat</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#development">Development</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🎯 Overview

**Bible OS** is a personal, open-source Bible reader application designed for deep Bible study and spiritual growth. Built with modern technologies (Rust, Tauri, React), it delivers a tiny (~20-30MB), fast, and beautifully designed desktop experience.

The app combines a powerful Bible reader with AI-powered capabilities for discussing scripture, generating spiritual content, and discovering deeper context—all offline-first and privacy-conscious.

## ✨ Features

- **📖 Powerful Bible Reader** - Clean, fast interface for reading through Bible books and chapters
- **🔍 Advanced Search** - Quickly find books, chapters, and verses across the entire Bible
- **🤖 AI Chat Integration** - Discuss scripture context, ask questions, and explore deeper meanings
- **🌙 Dark/Light Mode** - Comfortable reading experience in any lighting condition
- **⚡ Blazingly Fast** - Built with Rust and optimized for performance
- **💾 Lightweight** - Minimal footprint without sacrificing functionality
- **🔐 Privacy-First** - Your data stays on your machine

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="demo/app.png" alt="Main App Interface" width="300" /></td>
      <td><img src="demo/books_search.png" alt="Book Search" width="300" /></td>
    </tr>
    <tr>
      <td align="center"><em>Main Reader Interface</em></td>
      <td align="center"><em>Book & Search Navigation</em></td>
    </tr>
  </table>
  
  <table>
    <tr>
      <td><img src="demo/ai.png" alt="AI Chat" width="300" /></td>
      <td><img src="demo/discover.png" alt="Discover" width="300" /></td>
    </tr>
    <tr>
      <td align="center"><em>AI Chat Assistant</em></td>
      <td align="center"><em>Discovery Features</em></td>
    </tr>
  </table>
</div>

## 🛠️ Tech Stack

### Frontend

- **React** v19 - Modern UI framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS** v4 - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### Backend & Desktop

- **Tauri** v2.0 - Cross-platform desktop framework
- **Rust** - High-performance systems language
- **SQLite** - Efficient data storage
- **Tauri Plugins** - Native integrations (notifications, file system, global shortcuts)

### AI Features

- **Vercel AI SDK** - Unified AI integration (Open to switching to custom SDK)
- **OpenAI** - Language model capabilities

### Additional Libraries

- **Zod** - TypeScript-first schema validation
- **Lucide React** - Icon library
- **clsx** - Utility for classname management

## 📦 Installation

### Prerequisites

- **Node.js** v18+ and **pnpm**
- **Rust** (for building Tauri backend)
- **Xcode Command Line Tools** (macOS)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bible-os.git
   cd bible-os
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build the Bible database**

   ```bash
   pnpm db:build
   ```

4. **Start development server**
   ```bash
   pnpm tauri dev
   ```

The app will launch and you can start using it immediately!

### Building for Distribution

Build a production-optimized binary:

```bash
pnpm build
pnpm tauri build
```

This creates a distributable binary in `src-tauri/target/release/`.

## 🚀 Development

### Project Structure

```
bible-os/
├── src/                  # React frontend
│   ├── components/       # React components
│   ├── lib/             # Utilities, API, types
│   ├── stores/          # Zustand state stores
│   ├── hooks/           # Custom React hooks
│   └── App.tsx          # Main app component
├── src-tauri/           # Tauri backend (Rust)
│   ├── src/             # Rust source code
│   ├── Cargo.toml       # Rust dependencies
│   └── resources/       # Bible data (JSON)
└── demo/                # Demo screenshots
```

### Available Commands

```bash
# Start development server
pnpm dev

# Type check
pnpm tauri dev

# Build frontend
pnpm build

# Build desktop app
pnpm tauri build

# Preview production build
pnpm preview

# Rebuild Bible database from sources
pnpm db:build
```

### Setting Up AI Chat

To enable AI features, you'll need an API key:

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Set your API key in the app settings
3. Start chatting with the AI assistant about scripture

## 🔧 Configuration

The app uses several Tauri plugins configured in `src-tauri/tauri.conf.json`:

- **sql**: SQLite database operations
- **notification**: Desktop notifications
- **autostart**: Launch app on system startup
- **window-state**: Remember window position/size
- **global-shortcut**: Keyboard shortcuts
- **fs**: File system access
- **opener**: Open external links

## 📝 Scripture Data Format

Bible data is stored as JSON files in `src-tauri/resources/books/`:

```json
{
  "book": "Genesis",
  "chapters": [
    {
      "chapter": 1,
      "verses": [
        {
          "verse": 1,
          "text": "In the beginning God created the heavens and the earth."
        }
      ]
    }
  ]
}
```

## 🤝 Contributing

This is a personal project with open-source code. Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open-source. See LICENSE file for details.

## 💝 Acknowledgments

- Built by a developer passionate about Scripture and elegant software design
- Uses high-quality open-source libraries and frameworks
- Inspired by the need for a powerful, personal Bible study tool

---

<div align="center">
  <p>Made with ❤️ for Bible study and spiritual growth</p>
</div>
