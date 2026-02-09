# Visionary AI Storyboarder

AI-powered storyboard generator for product marketing using Google's Gemini AI.

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/conghii/chamcontentimage.git
cd chamcontentimage

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: http://localhost:3000/

### Configure API Key

**Option 1: Via UI (Recommended for users)**
1. Click the **"⚙️ API Key"** button in the top-right corner
2. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Enter and save the key
4. Key is stored in browser localStorage

**Option 2: Environment Variable (For developers)**
1. Copy `.env.example` to `.env`
2. Add your key: `GEMINI_API_KEY=your_api_key_here`

## 📦 Features

- **AI-Powered Scene Generation**: Generate 6 professional product scenes
- **Product Identity Analysis**: Ensures consistent product appearance across all scenes
- **Natural Photography**: Authentic lifestyle photography prompts
- **User API Key Management**: Secure localStorage-based API key configuration
- **Asset Upload**: Support for product images, packaging, and accessories

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **AI**: Google Generative AI (Gemini)
- **Styling**: Vanilla CSS

## 📁 Project Structure

```
chamcontentimage/
├── components/
│   ├── ApiKeySettings.tsx    # API key configuration UI
│   ├── AssetUploader.tsx      # Asset upload component
│   └── StoryboardCard.tsx     # Scene card display
├── services/
│   ├── geminiService.ts       # Gemini AI integration
│   └── productAnalyzer.ts     # Product identity analysis
├── App.tsx                     # Main application
├── types.ts                    # TypeScript definitions
└── .env.example                # Environment template
```

## 🌐 Deployment

### Netlify

1. **Connect Repository**:
   - New site from Git → Select `chamcontentimage`

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables** (Optional):
   - Add `VITE_GEMINI_API_KEY` if providing fallback key
   - Users can input their own key via UI

4. **Deploy**: Netlify will auto-deploy on every push to `main`

### Vercel / Other Platforms

Same build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

## 🔑 API Key Security

✅ **Secure Practices**:
- `.env` is gitignored
- Users input their own API keys via UI
- Keys stored in browser localStorage (not on server)
- No API keys committed to repository

⚠️ **Never commit** `.env` or any files containing API keys!

## 📝 License

MIT

## 🙏 Credits

Built with [Google Generative AI](https://ai.google.dev/)

---

**Repository**: https://github.com/conghii/chamcontentimage
