import { useState, useEffect } from 'react';
import { config } from '../utils/config';
import { SettingsContext } from './SettingsContextDefinition';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export { useSettings } from './SettingsContextDefinition';

export const SettingsProvider = ({ children }) => {
    // --- Model Configuration ---
    // modelConfigs: { [modelId]: apiKey }
    const [modelConfigs, setModelConfigs] = useState(() => {
        const saved = localStorage.getItem('gemini_model_configs');
        return saved ? JSON.parse(saved) : {};
    });

    const [defaultApiKey, setDefaultApiKey] = useState(() => {
        return localStorage.getItem('gemini_api_key') || config.API_KEY || '';
    });

    const [model, setModel] = useState(() => {
        return localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
    });

    // --- Chat Management ---
    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem('gemini_chats');
        if (saved) return JSON.parse(saved);

        // Migration: Check for old 'messages'
        const oldMessages = localStorage.getItem('messages');
        if (oldMessages) {
            const parsed = JSON.parse(oldMessages);
            if (parsed.length > 0) {
                const newChat = {
                    id: uuidv4(),
                    title: 'Migrated Chat',
                    messages: parsed,
                    modelId: 'gemini-2.5-flash',
                    pinned: false,
                    updatedAt: Date.now()
                };
                return [newChat];
            }
        }
        return [];
    });

    const [activeChatId, setActiveChatId] = useState(() => {
        return localStorage.getItem('gemini_active_chat_id') || null;
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    // --- Effects for Persistence ---
    useEffect(() => {
        localStorage.setItem('gemini_model_configs', JSON.stringify(modelConfigs));
    }, [modelConfigs]);

    useEffect(() => {
        if (defaultApiKey) {
            localStorage.setItem('gemini_api_key', defaultApiKey);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    }, [defaultApiKey]);

    useEffect(() => {
        localStorage.setItem('gemini_model', model);
    }, [model]);

    useEffect(() => {
        localStorage.setItem('gemini_chats', JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem('gemini_active_chat_id', activeChatId);
        } else {
            localStorage.removeItem('gemini_active_chat_id');
        }
    }, [activeChatId]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // --- Helper Functions ---

    const getApiKeyForModel = (modelId) => {
        return modelConfigs[modelId] || defaultApiKey;
    };

    const createChat = (modelId = model) => {
        const newChat = {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            modelId: modelId,
            pinned: false,
            updatedAt: Date.now()
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        return newChat.id;
    };

    const deleteChat = (chatId) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    const pinChat = (chatId) => {
        setChats(prev => prev.map(c =>
            c.id === chatId ? { ...c, pinned: !c.pinned } : c
        ));
    };

    const updateChat = (chatId, updates) => {
        setChats(prev => prev.map(c =>
            c.id === chatId ? { ...c, ...updates, updatedAt: Date.now() } : c
        ));
    };

    const updateChatMessages = (chatId, newMessages) => {
        setChats(prev => prev.map(c => {
            if (c.id === chatId) {
                // Auto-generate title from first user message if title is "New Chat"
                let title = c.title;
                if (c.title === 'New Chat' && newMessages.length > 0) {
                    const firstUserMsg = newMessages.find(m => m.role === 'user');
                    if (firstUserMsg) {
                        title = firstUserMsg.parts[0].text.slice(0, 30) + (firstUserMsg.parts[0].text.length > 30 ? '...' : '');
                    }
                }
                return { ...c, messages: newMessages, title, updatedAt: Date.now() };
            }
            return c;
        }));
    };

    // Ensure there's always an active chat if chats exist but none selected
    useEffect(() => {
        if (chats.length > 0 && !activeChatId) {
            setActiveChatId(chats[0].id);
        } else if (chats.length === 0 && !activeChatId) {
            // Don't auto-create here to avoid loops, handle in UI or on interaction
        }
    }, [chats, activeChatId]);

    const value = {
        // Config
        apiKey: defaultApiKey, // Deprecated access, prefer getApiKeyForModel
        setApiKey: setDefaultApiKey,
        modelConfigs,
        setModelConfigs,
        getApiKeyForModel,

        // Models
        model,
        setModel,
        availableModels: [
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Exp)' },
        ],

        // Chats
        chats,
        activeChatId,
        setActiveChatId,
        createChat,
        deleteChat,
        pinChat,
        updateChat,
        updateChatMessages,

        // Theme
        theme,
        setTheme,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
