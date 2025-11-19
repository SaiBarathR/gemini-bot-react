import { useState } from "react";
import GeminiService from "../service/gemini.service";
import { useSettings } from "../context/SettingsContext";

export default function useGemini() {
    const {
        activeChatId,
        chats,
        updateChatMessages,
        getApiKeyForModel,
        createChat
    } = useSettings();

    const [loading, setLoading] = useState(false);

    // Get current chat's messages
    const activeChat = chats.find(c => c.id === activeChatId);
    const messages = activeChat ? activeChat.messages : [];

    const sendMessages = async (text) => {
        let currentChatId = activeChatId;

        if (!currentChatId) {
            currentChatId = createChat();
        }

        const currentChat = chats.find(c => c.id === currentChatId) || {
            id: currentChatId,
            modelId: 'gemini-2.5-flash',
            messages: []
        };

        const apiKey = getApiKeyForModel(currentChat.modelId);

        // Optimistic update: Add user message only
        // If it's a new chat, messages might be empty, so we use the found chat or default empty array
        const currentMessages = currentChat.messages || [];
        const newHistory = [...currentMessages, { "role": "user", "parts": [{ "text": text }] }];

        updateChatMessages(currentChatId, newHistory);

        setLoading(true);

        // Local copy to track updates during streaming
        let currentHistory = [...newHistory];

        try {
            if (!apiKey) {
                throw new Error(`Please configure API Key for ${currentChat.modelId} in Settings.`);
            }

            const apiHistory = newHistory.map(m => ({
                role: m.role,
                parts: m.parts
            }));

            const stream = await GeminiService.sendMessages(text, apiHistory, apiKey, currentChat.modelId);

            let isFirstChunk = true;

            for await (const chunk of stream) {
                let chunkText = '';
                try {
                    chunkText = chunk.text();
                } catch (e) {
                    console.warn("Failed to get text from chunk", e);
                    continue; // Skip chunks without text (e.g. safety blocks)
                }

                if (isFirstChunk) {
                    isFirstChunk = false;
                    setLoading(false); // Stop "Thinking..." animation

                    // Add the model message with the first chunk
                    currentHistory = [...currentHistory, { "role": "model", "parts": [{ "text": chunkText }] }];
                } else {
                    // Append to the last message
                    const lastMsgIndex = currentHistory.length - 1;
                    // We need to clone the message to avoid direct mutation of state objects if they were from state
                    // But here currentHistory is a new array, and we are pushing new objects.
                    // However, the previous objects are refs. 
                    // The last object was just created in the `if` block or previous iteration, so it's safe to mutate its parts.
                    currentHistory[lastMsgIndex].parts[0].text += chunkText;
                }

                // Update global state
                updateChatMessages(currentChatId, [...currentHistory]);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setLoading(false);

            const lastMsg = currentHistory[currentHistory.length - 1];

            // If error happened mid-stream (last msg is model), append error
            if (lastMsg.role === 'model') {
                lastMsg.parts[0].text += `\n\n[Error: ${error.message}]`;
            } else {
                // If error happened before stream (last msg is user), add error message
                currentHistory = [...currentHistory, { "role": "model", "parts": [{ "text": `Error: ${error.message || "Something went wrong."}` }] }];
            }
            updateChatMessages(currentChatId, [...currentHistory]);
        } finally {
            setLoading(false);
        }
    }

    const clearMessages = () => {
        if (activeChatId) {
            updateChatMessages(activeChatId, []);
        }
    }

    return { messages, loading, sendMessages, clearMessages }
}
