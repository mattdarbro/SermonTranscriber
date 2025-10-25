# Sermon Transcriber & Metadata Generator

Transform your sermons into engaging YouTube content with AI-powered metadata generation.

## Features

- 📝 Text input support (paste or upload .txt files)
- 🤖 AI-powered metadata generation using Claude
- 🎯 SEO-optimized YouTube titles, descriptions, and tags
- 💾 Export all data in a formatted text file
- 🎨 Beautiful, modern UI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the root directory:

```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

To get an Anthropic API key:
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 3. Run the Application

You have two options:

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev
```

**Option B: Run them separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm start
```

The app will open at `http://localhost:3000` and the backend server runs on `http://localhost:3001`.

## Usage

1. **Choose Input Method**: Select "Text Input"
2. **Provide Transcription**: Upload a .txt file or paste your sermon transcription
3. **Generate Metadata**: Click the "Generate Metadata with AI" button
4. **Review & Edit**: Review the AI-generated metadata and make any edits
5. **Export**: Download all the data in a formatted text file

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude (Sonnet 4)

## Workflow Tip

For best results:
1. Use macOS Dictation or another transcription service to convert your sermon audio to text
2. Save the transcription as a .txt file
3. Upload it here
4. Generate metadata with AI
5. Export and use for your YouTube uploads!

## Development

- `npm start` - Run frontend only (React app on port 3000)
- `npm run server` - Run backend only (Express server on port 3001)
- `npm run dev` - Run both concurrently
- `npm run build` - Build for production
- `npm run preview` - Build and run production server locally
- `npm test` - Run tests

## Deployment

### Vercel Deployment

1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project" and import your repository
3. **Set Environment Variables**:
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `ANTHROPIC_API_KEY` with your actual API key
4. **Deploy**: Vercel will automatically deploy your app

The app will be available at your Vercel URL (e.g., `https://your-app-name.vercel.app`)

### Local Production Test

To test the production build locally:

```bash
npm run preview
```

This will build the React app and start the server, serving both the frontend and API on port 3001.

## Notes

- Audio transcription is not directly supported in the browser. Use external services like:
  - OpenAI Whisper
  - ElevenLabs
  - Google Cloud Speech-to-Text
  - macOS Dictation (built-in, free)
- The API key is stored securely on the backend and never exposed to the browser
- All data stays local - nothing is stored on external servers beyond the AI API call

## License

MIT
