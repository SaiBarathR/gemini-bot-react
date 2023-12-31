
# Gemini Bot

## Description

This project is an AI chatbot that uses the Gemini API from Google. It's designed for educational purposes, providing a practical example of how to implement a chat bot using Gemini API.

The chatbot has the following features:

- **Multi-Conversation**: The chatbot can handle multiple conversations at once. It initializes the chat by calling `startChat()`, and then uses `sendMessage()` to send new user messages. These messages, along with the chatbot's responses, are appended to the chat history.

- **User and Model Roles**: The chatbot uses two roles: 'user' and 'model'. The 'user' role provides the prompts, while the 'model' role provides the responses.

- **Streaming**: The chatbot uses streaming for faster interactions. Instead of waiting for the model to complete the entire generation process, the chatbot can handle partial results for quicker responses.

 ## Screenshots

  ![Screenshot 2023-12-31 at 6 41 27 PM](https://github.com/SaiBarathR/gemini-bot-react/assets/58382813/fe6aa8e8-40bb-468a-bb21-2a8697c195ba)


## Dependencies

This project uses the following libraries:

- React
- Vite
- Tailwind
- Chakra UI
- React Markdown
- @google/generative-ai

## API Key

To run this project, you'll need an API key from Google. You can get one for free at [Google AI](https://ai.google.dev/). The free API key comes with some limitations:

- Rate Limit: The free API key allows for up to 60 queries per minute.
- Data Usage: The input/output data is used to improve Google's products.

## Usage

To use this project:

1. Clone the repository.
2. Install the dependencies.
3. Insert your API key.
4. Run the project.

## License

This project is free to use for educational purposes.

## Links

- [Google AI](https://ai.google.dev/)
- [Google AI Web QuickStart](https://ai.google.dev/tutorials/web_quickstart)
