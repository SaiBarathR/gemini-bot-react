import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useConversationManager() {
    const [conversations, setConversations] = useState(() => loadConversations());
    const [currentConversationId, setCurrentConversationId] = useState(null);

    // Load conversations from localStorage
    function loadConversations() {
        try {
            const saved = localStorage.getItem('gemini_conversations');
            const conversations = saved ? JSON.parse(saved) : [];

            // If no conversations exist, create a default one
            if (conversations.length === 0) {
                const defaultConversation = createNewConversation();
                return [defaultConversation];
            }

            return conversations;
        } catch (error) {
            console.error('Error loading conversations:', error);
            return [createNewConversation()];
        }
    }

    // Save conversations to localStorage
    const saveConversations = useCallback((conversationsToSave) => {
        try {
            localStorage.setItem('gemini_conversations', JSON.stringify(conversationsToSave));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }, []);

    // Auto-save conversations when they change
    useEffect(() => {
        saveConversations(conversations);
    }, [conversations, saveConversations]);

    // Set current conversation to the first one if none is selected
    useEffect(() => {
        if (!currentConversationId && conversations.length > 0) {
            setCurrentConversationId(conversations[0].id);
        }
    }, [currentConversationId, conversations]);

    // Create a new conversation
    function createNewConversation(title = null) {
        const now = new Date().toISOString();
        return {
            id: uuidv4(),
            title: title || 'New Conversation',
            messages: [],
            createdAt: now,
            updatedAt: now,
            preview: 'Start a new conversation...',
            messageCount: 0,
            starred: false,
            archived: false,
            settings: {
                model: 'gemini-2.0-flash',
                temperature: 0.7,
                maxTokens: 8192,
                systemPrompt: '',
                enableSystemPrompt: false
            }
        };
    }

    // Get current conversation
    const getCurrentConversation = useCallback(() => {
        return conversations.find(conv => conv.id === currentConversationId) || conversations[0];
    }, [conversations, currentConversationId]);

    // Create new conversation
    const createConversation = useCallback((title = null) => {
        const newConversation = createNewConversation(title);
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        return newConversation;
    }, []);

    // Select conversation
    const selectConversation = useCallback((conversationId) => {
        setCurrentConversationId(conversationId);
    }, []);

    // Update conversation
    const updateConversation = useCallback((conversationId, updates) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId
                ? {
                    ...conv,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                : conv
        ));
    }, []);

    // Add message to conversation
    const addMessageToConversation = useCallback((conversationId, message) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                const newMessages = [...conv.messages, message];
                const preview = message.role === 'user'
                    ? message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
                    : conv.preview;

                // Auto-generate title from first user message
                let title = conv.title;
                if (conv.title === 'New Conversation' && message.role === 'user') {
                    title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
                }

                return {
                    ...conv,
                    messages: newMessages,
                    messageCount: newMessages.length,
                    updatedAt: new Date().toISOString(),
                    preview,
                    title
                };
            }
            return conv;
        }));
    }, []);

    // Update message in conversation
    const updateMessageInConversation = useCallback((conversationId, messageId, updates) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                const updatedMessages = conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                );
                return {
                    ...conv,
                    messages: updatedMessages,
                    updatedAt: new Date().toISOString()
                };
            }
            return conv;
        }));
    }, []);

    // Delete message from conversation
    const deleteMessageFromConversation = useCallback((conversationId, messageId) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                const filteredMessages = conv.messages.filter(msg => msg.id !== messageId);
                return {
                    ...conv,
                    messages: filteredMessages,
                    messageCount: filteredMessages.length,
                    updatedAt: new Date().toISOString()
                };
            }
            return conv;
        }));
    }, []);

    // Delete conversation
    const deleteConversation = useCallback((conversationId) => {
        setConversations(prev => {
            const filtered = prev.filter(conv => conv.id !== conversationId);

            // If we deleted the current conversation, switch to another one
            if (conversationId === currentConversationId) {
                if (filtered.length > 0) {
                    setCurrentConversationId(filtered[0].id);
                } else {
                    // Create a new conversation if none exist
                    const newConv = createNewConversation();
                    setCurrentConversationId(newConv.id);
                    return [newConv];
                }
            }

            return filtered;
        });
    }, [currentConversationId]);

    // Rename conversation
    const renameConversation = useCallback((conversationId, newTitle) => {
        updateConversation(conversationId, { title: newTitle });
    }, [updateConversation]);

    // Star/unstar conversation
    const toggleStarConversation = useCallback((conversationId) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId
                ? { ...conv, starred: !conv.starred }
                : conv
        ));
    }, []);

    // Archive/unarchive conversation
    const toggleArchiveConversation = useCallback((conversationId) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId
                ? { ...conv, archived: !conv.archived }
                : conv
        ));
    }, []);

    // Clear conversation messages
    const clearConversation = useCallback((conversationId) => {
        updateConversation(conversationId, {
            messages: [],
            messageCount: 0,
            preview: 'Start a new conversation...'
        });
    }, [updateConversation]);

    // Export conversation
    const exportConversation = useCallback((conversationId, format = 'json') => {
        const conversation = conversations.find(conv => conv.id === conversationId);
        if (!conversation) return;

        let content, mimeType, extension;

        switch (format) {
            case 'markdown':
                content = exportToMarkdown(conversation);
                mimeType = 'text/markdown';
                extension = 'md';
                break;
            case 'txt':
                content = exportToText(conversation);
                mimeType = 'text/plain';
                extension = 'txt';
                break;
            case 'html':
                content = exportToHTML(conversation);
                mimeType = 'text/html';
                extension = 'html';
                break;
            default:
                content = JSON.stringify(conversation, null, 2);
                mimeType = 'application/json';
                extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${conversation.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [conversations]);

    // Export formats
    const exportToMarkdown = (conversation) => {
        let content = `# ${conversation.title}\n\n`;
        content += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n`;
        content += `**Updated:** ${new Date(conversation.updatedAt).toLocaleString()}\n\n`;

        conversation.messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'AI';
            content += `## ${role}\n\n${message.content}\n\n`;
        });

        return content;
    };

    const exportToText = (conversation) => {
        let content = `${conversation.title}\n${'='.repeat(conversation.title.length)}\n\n`;
        content += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
        content += `Updated: ${new Date(conversation.updatedAt).toLocaleString()}\n\n`;

        conversation.messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'AI';
            content += `${role}: ${message.content}\n\n`;
        });

        return content;
    };

    const exportToHTML = (conversation) => {
        let content = `<!DOCTYPE html>
<html>
<head>
    <title>${conversation.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
        .user { background-color: #e3f2fd; }
        .ai { background-color: #f5f5f5; }
        .role { font-weight: bold; margin-bottom: 10px; }
        pre { background-color: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>${conversation.title}</h1>
    <p><strong>Created:</strong> ${new Date(conversation.createdAt).toLocaleString()}</p>
    <p><strong>Updated:</strong> ${new Date(conversation.updatedAt).toLocaleString()}</p>
`;

        conversation.messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'AI';
            const className = message.role === 'user' ? 'user' : 'ai';
            content += `    <div class="message ${className}">
        <div class="role">${role}</div>
        <div>${message.content.replace(/\n/g, '<br>')}</div>
    </div>
`;
        });

        content += `</body>
</html>`;

        return content;
    };

    // Import conversation
    const importConversation = useCallback((conversationData) => {
        try {
            // Validate the conversation data
            if (!conversationData.id || !conversationData.title || !Array.isArray(conversationData.messages)) {
                throw new Error('Invalid conversation format');
            }

            // Ensure unique ID
            const newId = uuidv4();
            const importedConversation = {
                ...conversationData,
                id: newId,
                updatedAt: new Date().toISOString()
            };

            setConversations(prev => [importedConversation, ...prev]);
            setCurrentConversationId(newId);

            return importedConversation;
        } catch (error) {
            console.error('Error importing conversation:', error);
            throw error;
        }
    }, []);

    // Get conversation statistics
    const getStatistics = useCallback(() => {
        const totalConversations = conversations.length;
        const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0);
        const starredCount = conversations.filter(conv => conv.starred).length;
        const archivedCount = conversations.filter(conv => conv.archived).length;

        return {
            totalConversations,
            totalMessages,
            starredCount,
            archivedCount,
            activeConversations: totalConversations - archivedCount
        };
    }, [conversations]);

    return {
        // State
        conversations: conversations.filter(conv => !conv.archived), // Hide archived by default
        allConversations: conversations,
        currentConversationId,
        currentConversation: getCurrentConversation(),

        // Actions
        createConversation,
        selectConversation,
        updateConversation,
        deleteConversation,
        renameConversation,
        clearConversation,

        // Message management
        addMessageToConversation,
        updateMessageInConversation,
        deleteMessageFromConversation,

        // Advanced features
        toggleStarConversation,
        toggleArchiveConversation,
        exportConversation,
        importConversation,

        // Utilities
        getStatistics
    };
} 