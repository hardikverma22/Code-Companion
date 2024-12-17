# LeetCodeGPT 🧠🚀

## Overview
LeetCodeGPT is a powerful Chrome extension that transforms your LeetCode problem-solving experience by providing intelligent, AI-powered assistance right on the problem page.

## Features
- 🔑 Simple OpenAI API Key configuration
- 💡 Contextual problem-solving hints
- 🤖 AI-generated code solutions
- 📝 Detailed problem explanation and feedback
- 💾 Local chat history storage
- 🌐 Seamless integration with LeetCode interface

## Installation
- run either of the below command which will generate dist folder, choose dist folder while unpacking in chrome extension in developer mode.
  ```
  pnpm run build
  ```
  ```
  npm run build
  ```
  
### Prerequisites
- Google Chrome Browser
- OpenAI API Key

### Steps
1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the dist directory

## Configuration
1. Click on the extension icon
2. Enter your OpenAI API Key

## Usage
- Navigate to any LeetCode problem page
- Click the AI Assistant bubble at the bottom right
- Receive hints, explanations, and solutions

## Technologies
- JavaScript
- Chrome Extension API
- OpenAI API
- IndexedDB for local storage

## Privacy & Security
- API Key is stored locally in Chrome storage
- No external data transmission except OpenAI API calls

## Limitations
- Requires active OpenAI API Key
- Solution quality depends on OpenAI model capabilities

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License
[MIT]

## Disclaimer
This project is not affiliated with LeetCode or OpenAI. Use responsibly and respect coding challenge guidelines.
