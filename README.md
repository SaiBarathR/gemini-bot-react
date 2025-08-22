# 🤖 Gemini AI Chat - Modern React App

A modern, feature-rich AI chat application built with React and powered by Google's latest **Gemini 2.0 Flash** model. This app provides a ChatGPT-like experience with advanced features and a beautiful, responsive UI.

## ✨ Features

### 🚀 Modern AI Integration
- **Latest Gemini 2.0 Flash Model** - Lightning-fast responses with advanced capabilities
- **Real-time Streaming** - See responses as they're generated
- **Context Awareness** - Maintains conversation history for coherent dialogues
- **Error Handling** - Robust error handling with user-friendly messages

### 💬 Advanced Chat Features
- **Message Management** - Edit, delete, and regenerate messages
- **Copy to Clipboard** - Easy message copying with one click
- **Export/Import Chats** - Save and restore conversation history
- **Typing Indicators** - Visual feedback during AI response generation
- **Message Timestamps** - Track when messages were sent

### 🎨 Modern UI/UX
- **Beautiful Design** - Clean, modern interface with smooth animations
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode Ready** - Built with Chakra UI theming system
- **Syntax Highlighting** - Code blocks with proper syntax highlighting
- **Markdown Support** - Rich text formatting in messages

### 🔧 Developer Features
- **TypeScript Ready** - Full TypeScript support (optional)
- **Modern React Hooks** - Uses latest React patterns and hooks
- **Optimized Performance** - Efficient rendering and memory management
- **Offline Detection** - Handles network connectivity gracefully

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Gemini API key (get one [here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd gemini-bot-react
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` to start chatting!

## 🛠️ Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY` - Your Gemini API key (required)

### Model Configuration
You can customize the AI model behavior in `src/utils/config.js`:
- `MODEL_NAME` - Gemini model version (default: "gemini-2.0-flash")
- `MAX_TOKENS` - Maximum response length (default: 8192)
- `TEMPERATURE` - Response creativity (0-2, default: 0.7)
- `TOP_P` - Nucleus sampling parameter (default: 0.8)
- `TOP_K` - Top-k sampling parameter (default: 40)

## 📱 Usage

### Basic Chat
- Type your message in the input field
- Press Enter or click the send button
- Watch as the AI responds in real-time

### Advanced Features
- **Edit Messages**: Click the menu button on any user message to edit
- **Regenerate Responses**: Use the regenerate option on AI messages
- **Copy Messages**: Click the copy button to copy any message
- **Export Chat**: Save your conversation as a JSON file
- **Import Chat**: Load a previously saved conversation
- **Clear Chat**: Start fresh with a clean conversation

### Suggested Prompts
The welcome screen provides various conversation starters:
- Code assistance and debugging
- Creative writing and brainstorming
- Educational explanations
- Problem-solving and analysis
- Design and creative ideas

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── ChatWithGemini.jsx    # Main chat interface
│   ├── MessageBubble.jsx     # Individual message component
│   ├── ChatInput.jsx         # Message input component
│   └── WelcomeScreen.jsx     # Welcome/landing screen
├── hooks/              # Custom React hooks
│   └── useGemini.jsx        # Main chat logic hook
├── service/            # API services
│   └── gemini.service.js    # Gemini API integration
├── utils/              # Utility functions
│   └── config.js           # App configuration
└── icons/              # Icon assets
```

### Key Technologies
- **React 18** - Modern React with hooks and concurrent features
- **Chakra UI** - Component library for beautiful UI
- **Framer Motion** - Smooth animations and transitions
- **React Markdown** - Markdown rendering for rich text
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and development server

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create new components in `src/components/`
2. Add business logic to `src/hooks/useGemini.jsx`
3. Update the service layer in `src/service/gemini.service.js`
4. Configure new settings in `src/utils/config.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🔒 Security

- **API Key Protection**: Never commit your API key to version control
- **Environment Variables**: Use `.env` files for sensitive configuration
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Graceful error handling prevents crashes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- Chakra UI team for the amazing component library
- React team for the excellent framework
- All contributors and users of this project

---

**Made with ❤️ and modern web technologies**
