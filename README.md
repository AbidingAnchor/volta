# Volta - AI Content Repurposing Tool

A modern React web application that transforms blog posts and articles into multiple social media formats using AI.

## Features

- **Twitter/X Thread**: Generates 5 tweets from your content
- **LinkedIn Post**: Creates professional LinkedIn posts with hashtags
- **Instagram Caption**: Produces engaging Instagram captions with emojis
- **Email Newsletter Intro**: Writes compelling email introductions

Each output includes a one-click copy button for easy sharing.

## Tech Stack

- React 18
- Groq API (llama-3.3-70b-versatile model)
- Premium dark theme UI

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add your Groq API key**:
   - Open `src/App.js`
   - Find the line: `'Authorization': 'Bearer gsk_your_api_key_here'`
   - Replace `gsk_your_api_key_here` with your actual Groq API key

3. **Start the development server**:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Paste your blog post or article into the text area
2. Click the "⚡ Repurpose Content" button
3. Wait for the AI to generate all 4 formats
4. Use the copy button on each card to copy the content

## API Key

To get a Groq API key:
- Visit [https://console.groq.com/](https://console.groq.com/)
- Sign up or log in
- Create a new API key
- Add it to the application as described above

## Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` folder.
