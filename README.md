# 📹🎤 Camera & Mic Check

A modern, privacy-focused web application for testing your camera and microphone before video calls, recordings, or streaming sessions.

**[Live Demo](https://camera-mic-check.vercel.app)** _(update with your deployment URL)_

![Camera & Mic Check Screenshot](https://via.placeholder.com/800x450?text=App+Screenshot)

## ✨ Features

### 🎥 Camera Testing
- **Live video preview** with real-time display
- **Resolution detection** showing current video dimensions
- **Multi-camera support** with easy device switching
- **Visual status indicators** for recording/live state

### 🎤 Microphone Testing
- **Real-time audio level meter** with animated visualization
- **Peak level detection** to track maximum input
- **Sound detection feedback** confirming your mic is working
- **Multi-microphone support** with device selection

### 🔐 Permission Management
- Clear permission status indicators
- One-click permission request
- Helpful error messages for troubleshooting
- Automatic device detection when permissions granted

### 🎨 Modern UI/UX
- Clean, professional design
- **Dark mode support** (auto-detected from system preferences)
- Fully responsive for desktop and mobile
- Smooth animations and transitions
- Accessible (ARIA labels, keyboard navigation)

### 🔒 Privacy First
- **100% client-side processing** — no data leaves your browser
- No cookies, tracking, or analytics
- No server uploads or external API calls
- Works offline after initial load

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/InvictusNavarchus/camera-mic-check.git
cd camera-mic-check

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Create production build
bun run build

# Preview production build locally
bun run preview
```

## 🛠️ Tech Stack

- **[SvelteKit 5](https://svelte.dev/)** — Modern web framework with runes
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **Web APIs**:
  - [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) — Camera/mic access
  - [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) — Permission management
  - [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — Audio analysis

## 📁 Project Structure

```
camera-mic-check/
├── src/
│   ├── lib/
│   │   ├── components/       # Svelte components
│   │   │   ├── AudioMeter.svelte
│   │   │   ├── CameraPreview.svelte
│   │   │   ├── DeviceSelector.svelte
│   │   │   ├── PermissionStatus.svelte
│   │   │   └── TestControls.svelte
│   │   ├── assets/           # Static assets
│   │   ├── media-utils.ts    # Media device utilities
│   │   └── types.ts          # TypeScript types
│   ├── routes/
│   │   ├── +layout.svelte    # Root layout
│   │   ├── +page.svelte      # Main page
│   │   └── layout.css        # Global styles
│   └── app.html              # HTML template
├── static/                   # Public static files
├── svelte.config.js          # SvelteKit config
├── tailwind.config.ts        # Tailwind config
└── vite.config.ts            # Vite config
```

## 🌐 Deployment

This app can be deployed to any static hosting platform:

### Vercel (Recommended)
```bash
bunx vercel
```

### Netlify
```bash
bunx netlify deploy --prod --dir=build
```

### Cloudflare Pages
```bash
bunx wrangler pages deploy build
```

> **Note:** You may need to install the appropriate [SvelteKit adapter](https://svelte.dev/docs/kit/adapters) for your deployment target.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Svelte](https://svelte.dev/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All contributors and users of this project

---

<p align="center">
  Made with ❤️ for better video calls
</p>
