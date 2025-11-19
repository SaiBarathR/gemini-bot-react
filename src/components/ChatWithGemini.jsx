import React, { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Loader2, ChevronDown, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import useGemini from "../hooks/useGemini";
import { useSettings } from "../context/SettingsContext";
import { cn } from "../utils/cn";

const ChatWithGemini = () => {
    const { messages, loading, sendMessages, clearMessages } = useGemini();
    const { activeChatId, chats, updateChat, availableModels } = useSettings();
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    const activeChat = chats.find(c => c.id === activeChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input;
        setInput('');
        await sendMessages(msg);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleModelChange = (e) => {
        if (activeChatId) {
            updateChat(activeChatId, { modelId: e.target.value });
        }
    };

    const CodeBlock = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return !inline && match ? (
            <div className="relative rounded-lg overflow-hidden my-4 border border-gray-700">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-xs font-medium text-gray-400 lowercase">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy code'}
                    </button>
                </div>
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: 0, background: '#1e1e1e' }}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code {...props} className={cn("bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm", className)}>
                {children}
            </code>
        );
    };

    if (!activeChatId && chats.length === 0) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-gray-950 p-4 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    <Bot size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to Gemini Bot
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Start a new conversation to get help with code, writing, analysis, and more.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                        {activeChat?.title || 'New Chat'}
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {messages.length} messages
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={activeChat?.modelId || ''}
                            onChange={handleModelChange}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 border border-transparent focus:border-blue-500 focus:ring-0 cursor-pointer"
                        >
                            {availableModels.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Bot size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            This chat uses <strong>{availableModels.find(m => m.id === activeChat?.modelId)?.name}</strong>.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4 max-w-4xl mx-auto",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white"
                                        : "bg-purple-600 text-white"
                                )}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>

                                <div className={cn(
                                    "flex-1 rounded-2xl px-6 py-4 shadow-sm overflow-hidden",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-gray-800"
                                )}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        className="prose dark:prose-invert max-w-none text-sm md:text-base break-words"
                                        components={{
                                            code: CodeBlock,
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                    <table {...props} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => (
                                                <thead {...props} className="bg-gray-50 dark:bg-gray-800" />
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th {...props} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" />
                                            ),
                                            td: ({ node, ...props }) => (
                                                <td {...props} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700" />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul {...props} className="list-disc list-outside ml-5 my-2 space-y-1" />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol {...props} className="list-decimal list-outside ml-5 my-2 space-y-1" />
                                            ),
                                            li: ({ node, ...props }) => (
                                                <li {...props} className="pl-1" />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" />
                                            ),
                                        }}
                                    >
                                        {msg.parts[0].text}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 max-w-4xl mx-auto"
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl rounded-tl-none px-6 py-4 border border-gray-200 dark:border-gray-800 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button
                        onClick={clearMessages}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        title="Clear Chat"
                    >
                        <Trash2 size={20} />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-transparent transition-all max-h-32 min-h-[3rem]"
                            rows={1}
                            style={{ height: 'auto', minHeight: '48px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatWithGemini;