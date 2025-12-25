# OpenAI Text-to-Speech MP3 Generator

A production-ready Next.js application that converts text into natural-sounding speech using the OpenAI Speech API. Generate high-quality MP3 audio files with multiple AI voices and quality settings.

## Features

- 🎙️ **Multiple AI Voices**: Choose from 6 different OpenAI voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 🎵 **Quality Options**: Select between standard (tts-1) and HD (tts-1-hd) audio quality
- 📝 **Real-time Character Count**: Track your text length with live character counter (4096 max)
- 🎧 **Instant Playback**: Listen to generated speech directly in the browser
- 💾 **Download MP3**: Save generated audio as MP3 files
- ⚡ **Fast & Responsive**: Built with Next.js 15 and modern React
- 🎨 **Beautiful UI**: Premium design with shadcn/ui components and Tailwind CSS
- 🔒 **Secure**: API key stored in environment variables
- ⚠️ **Error Handling**: Comprehensive error messages and validation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API**: OpenAI Node SDK
- **Notifications**: Sonner

## Prerequisites

- Node.js 18.17 or later
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd openai-tts-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Text**: Type or paste the text you want to convert (up to 4096 characters)
2. **Select Voice**: Choose from 6 AI voices
3. **Choose Quality**: Select standard or HD quality
4. **Generate**: Click "Generate Speech" to create your audio
5. **Listen**: Play the audio directly in the browser
6. **Download**: Save the MP3 file to your device

## Available Voices

- **Alloy**: Neutral and balanced
- **Echo**: Clear and articulate
- **Fable**: Expressive and warm
- **Onyx**: Deep and authoritative
- **Nova**: Energetic and friendly
- **Shimmer**: Smooth and pleasant

## API Routes

### POST `/api/text-to-speech`

Converts text to speech and returns an MP3 file.

**Request Body:**
```json
{
  "text": "Your text here",
  "voice": "alloy",
  "model": "tts-1"
}
```

**Response:**
- Success: Returns MP3 audio file (audio/mpeg)
- Error: Returns JSON with error message

## Project Structure

```
openai-tts-generator/
├── app/
│   ├── api/
│   │   └── text-to-speech/
│   │       └── route.ts          # API route for TTS
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── text-to-speech-form.tsx  # Main TTS form
├── lib/
│   └── utils.ts                  # Utility functions
├── .env.local.example            # Environment template
└── package.json
```

## Build for Production

```bash
npm run build
npm start
```

## Error Handling

The application handles various error scenarios:

- Missing API key
- Invalid text input
- Text too long (>4096 characters)
- Invalid voice or model selection
- OpenAI API errors
- Network errors

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [OpenAI](https://openai.com/)
