import { GoogleGenAI } from "@google/genai";
import { config } from "../utils/config";

class GeminiService {
    constructor() {
        if (!config.API_KEY) {
            throw new Error("VITE_GEMINI_API_KEY environment variable is required");
        }
        
        this.ai = new GoogleGenAI({ apiKey: config.API_KEY });
        this.currentChat = null;
    }

    // Initialize a new chat session
    createChat(history = []) {
        this.currentChat = this.ai.chats.create({
            model: config.MODEL_NAME,
            history: this.formatHistory(history),
            config: {
                maxOutputTokens: config.MAX_TOKENS,
                temperature: config.TEMPERATURE,
                topP: config.TOP_P,
                topK: config.TOP_K,
            }
        });
        return this.currentChat;
    }

    // Send a message with streaming response
    async sendMessageStream(message) {
        if (!this.currentChat) {
            this.createChat();
        }

        try {
            const stream = await this.currentChat.sendMessageStream({
                message: message
            });
            return stream;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    // Send a message without streaming
    async sendMessage(message) {
        if (!this.currentChat) {
            this.createChat();
        }

        try {
            const response = await this.currentChat.sendMessage({
                message: message
            });
            return response;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    // Generate content with custom configuration
    async generateContent(prompt, customConfig = {}) {
        try {
            const response = await this.ai.models.generateContent({
                model: config.MODEL_NAME,
                contents: prompt,
                config: {
                    maxOutputTokens: config.MAX_TOKENS,
                    temperature: config.TEMPERATURE,
                    topP: config.TOP_P,
                    topK: config.TOP_K,
                    ...customConfig
                }
            });
            return response;
        } catch (error) {
            console.error("Error generating content:", error);
            throw error;
        }
    }

    // Generate content with streaming
    async generateContentStream(prompt, customConfig = {}) {
        try {
            const stream = await this.ai.models.generateContentStream({
                model: config.MODEL_NAME,
                contents: prompt,
                config: {
                    maxOutputTokens: config.MAX_TOKENS,
                    temperature: config.TEMPERATURE,
                    topP: config.TOP_P,
                    topK: config.TOP_K,
                    ...customConfig
                }
            });
            return stream;
        } catch (error) {
            console.error("Error generating content stream:", error);
            throw error;
        }
    }

    // Format history for the new SDK
    formatHistory(messages) {
        return messages.map(message => ({
            role: message.role === "model" ? "model" : "user",
            parts: message.parts || [{ text: message.content || message.text || "" }]
        }));
    }

    // Reset chat session
    resetChat() {
        this.currentChat = null;
    }

    // Get chat history
    getChatHistory() {
        return this.currentChat ? this.currentChat.history : [];
    }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;
