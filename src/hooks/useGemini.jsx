import { useEffect, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import geminiService from "../service/gemini.service";

export default function useGemini() {
    const [messages, setMessages] = useState(() => checkForMessages());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const abortControllerRef = useRef(null);

    function checkForMessages() {
        try {
            const savedMessages = localStorage.getItem('gemini_chat_messages');
            return savedMessages ? JSON.parse(savedMessages) : [];
        } catch (error) {
            console.error('Error loading messages from localStorage:', error);
            return [];
        }
    }

    // Save messages to localStorage
    const saveMessages = useCallback((messagesToSave) => {
        try {
            localStorage.setItem('gemini_chat_messages', JSON.stringify(messagesToSave));
        } catch (error) {
            console.error('Error saving messages to localStorage:', error);
        }
    }, []);

    // Auto-save messages when they change
    useEffect(() => {
        if (messages.length > 0) {
            saveMessages(messages);
        }
    }, [messages, saveMessages]);

    // Create a new message object
    const createMessage = useCallback((role, content, id = null) => ({
        id: id || uuidv4(),
        role,
        content,
        timestamp: new Date().toISOString(),
        parts: [{ text: content }]
    }), []);

    // Add a message to the chat
    const addMessage = useCallback((message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    // Update a specific message
    const updateMessage = useCallback((messageId, content) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, content, parts: [{ text: content }] }
                : msg
        ));
    }, []);

    // Delete a message
    const deleteMessage = useCallback((messageId) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, []);

    // Clear all messages
    const clearMessages = useCallback(() => {
        setMessages([]);
        localStorage.removeItem('gemini_chat_messages');
        geminiService.resetChat();
        setError(null);
    }, []);

    // Stop current generation
    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setIsTyping(false);
        setStreamingMessageId(null);
    }, []);

    // Send a message with streaming response
    const sendMessage = useCallback(async (userMessage, options = {}) => {
        if (!userMessage.trim() || loading) return;

        const { conversationId, settings = {}, onMessageUpdate } = options;

        setError(null);
        setLoading(true);
        setIsTyping(true);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            // Apply settings to gemini service
            if (settings.systemPrompt && settings.enableSystemPrompt) {
                geminiService.createChat([], {
                    systemInstruction: settings.systemPrompt,
                    maxOutputTokens: settings.maxTokens || 8192,
                    temperature: settings.temperature || 0.7,
                    topP: settings.topP || 0.8,
                    topK: settings.topK || 40,
                });
            } else {
                geminiService.createChat([], {
                    maxOutputTokens: settings.maxTokens || 8192,
                    temperature: settings.temperature || 0.7,
                    topP: settings.topP || 0.8,
                    topK: settings.topK || 40,
                });
            }

            // Send message with streaming
            const stream = await geminiService.sendMessageStream(userMessage.trim());

            let fullResponse = '';

            for await (const chunk of stream) {
                // Check if generation was aborted
                if (abortControllerRef.current?.signal.aborted) {
                    break;
                }

                const chunkText = chunk.text || '';
                fullResponse += chunkText;

                // Update via callback if provided
                if (onMessageUpdate) {
                    onMessageUpdate(fullResponse);
                }
            }

            setIsTyping(false);

        } catch (error) {
            console.error('Error sending message:', error);

            // Handle different error types
            let errorMessage = 'Sorry, I encountered an error. Please try again.';

            if (error.name === 'AbortError') {
                errorMessage = 'Message generation was stopped.';
            } else if (error.message?.includes('API key')) {
                errorMessage = 'API key is invalid or missing. Please check your configuration.';
            } else if (error.message?.includes('quota')) {
                errorMessage = 'API quota exceeded. Please try again later.';
            } else if (error.message?.includes('network')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
            setIsTyping(false);

            // Update via callback if provided
            if (onMessageUpdate) {
                onMessageUpdate(errorMessage);
            }
        } finally {
            setLoading(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
        }
    }, [loading]);

    // Regenerate last response
    const regenerateResponse = useCallback(async () => {
        if (messages.length < 2) return;

        const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message
        const messagesWithoutLastResponse = messages.filter((msg, index) =>
            !(index === messages.length - 1 && msg.role === 'model')
        );
        setMessages(messagesWithoutLastResponse);

        // Resend the last user message
        await sendMessage(lastUserMessage.content);
    }, [messages, sendMessage]);

    // Edit and resend a message
    const editMessage = useCallback(async (messageId, newContent) => {
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) return;

        // Remove all messages after the edited message
        const newMessages = messages.slice(0, messageIndex);
        setMessages(newMessages);

        // Send the edited message
        await sendMessage(newContent);
    }, [messages, sendMessage]);

    // Export chat history
    const exportChat = useCallback(() => {
        const chatData = {
            messages,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [messages]);

    // Import chat history
    const importChat = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const chatData = JSON.parse(e.target.result);
                    if (chatData.messages && Array.isArray(chatData.messages)) {
                        setMessages(chatData.messages);
                        resolve(chatData);
                    } else {
                        reject(new Error('Invalid chat file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }, []);

    return {
        // State
        messages,
        loading,
        error,
        isTyping,
        streamingMessageId,

        // Actions
        sendMessage,
        addMessage,
        updateMessage: setMessages, // Keep the old interface for compatibility
        deleteMessage,
        clearMessages,
        stopGeneration,
        regenerateResponse,
        editMessage,
        exportChat,
        importChat,

        // Utilities
        createMessage,
        messageCount: messages.length,
        hasMessages: messages.length > 0
    };
}
