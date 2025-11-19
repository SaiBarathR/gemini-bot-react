import React, { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Loader2, ChevronDown, Copy, Check, Sparkles, Code, BookOpen, Lightbulb } from 'lucide-react';
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
    const textareaRef = useRef(null);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const modelDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
                setIsModelDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeChat = chats.find(c => c.id === activeChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        await sendMessages(text);
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
            <div className="relative rounded-lg overflow-hidden my-6 border border-zinc-800 shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-xs font-medium text-zinc-400 lowercase">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
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
                    customStyle={{ margin: 0, borderRadius: 0, background: '#09090b', padding: '1.5rem' }}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code {...props} className={cn("bg-zinc-800 text-zinc-200 rounded px-1.5 py-0.5 font-mono text-sm", className)}>
                {children}
            </code>
        );
    };

    const suggestions = [
        { icon: <Code size={20} />, text: "Write a React component for a todo list" },
        { icon: <BookOpen size={20} />, text: "Explain quantum entanglement simply" },
        { icon: <Sparkles size={20} />, text: "Generate creative blog post titles" },
        { icon: <Lightbulb size={20} />, text: "Tips for improving productivity" },
    ];

    if (!activeChatId && chats.length === 0 || messages.length === 0) {
        return (
            <div className="flex flex-col h-full bg-primary relative transition-colors duration-300">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-color bg-primary/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-medium text-text-primary truncate max-w-[200px]">
                            {activeChat?.title || 'New Chat'}
                        </h2>
                    </div>

                    <div className="relative" ref={modelDropdownRef}>
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-text-primary border border-border-color hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span>{availableModels.find(m => m.id === (activeChat?.modelId || 'gemini-2.5-flash'))?.name}</span>
                            <ChevronDown size={12} className={`text-text-secondary transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isModelDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-secondary rounded-xl shadow-xl border border-border-color overflow-hidden z-50 py-1"
                                >
                                    {availableModels.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                if (activeChatId) {
                                                    updateChat(activeChatId, { modelId: m.id });
                                                }
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group",
                                                (activeChat?.modelId || 'gemini-2.5-flash') === m.id
                                                    ? "bg-zinc-200 dark:bg-zinc-800 text-text-primary font-medium"
                                                    : "text-text-secondary hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-text-primary"
                                            )}
                                        >
                                            {m.name}
                                            {(activeChat?.modelId || 'gemini-2.5-flash') === m.id && (
                                                <Check size={14} className="text-text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="max-w-2xl w-full space-y-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto ring-1 ring-border-color shadow-xl backdrop-blur-sm">
                                <Bot size={32} className="text-text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
                                How can I help you today?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(s.text)}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary border border-border-color hover:bg-zinc-800/50 transition-all group text-left"
                                >
                                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                                        {s.icon}
                                    </div>
                                    <span className="text-sm text-text-secondary group-hover:text-text-primary font-medium">
                                        {s.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Area for Empty State */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary via-primary to-transparent pt-20 transition-colors duration-300">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-secondary rounded-2xl border border-border-color shadow-2xl focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Gemini..."
                                className="w-full bg-transparent text-text-primary rounded-2xl px-4 py-4 pr-12 resize-none focus:outline-none max-h-[200px] min-h-[56px] scrollbar-thin scrollbar-thumb-zinc-700"
                                rows={1}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className="absolute right-3 bottom-3 p-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-xs text-text-secondary">
                                Gemini can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-primary relative transition-colors duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-color bg-primary/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-text-primary truncate max-w-[200px]">
                        {activeChat?.title || 'New Chat'}
                    </h2>
                </div>

                <div className="relative group">
                    <select
                        value={activeChat?.modelId || ''}
                        onChange={handleModelChange}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-secondary text-xs font-medium text-text-primary border border-border-color focus:border-zinc-500 focus:ring-0 cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                        {availableModels.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none group-hover:text-text-primary" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-32 scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="max-w-3xl mx-auto space-y-8">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 border border-border-color">
                                        <Bot size={16} className="text-text-primary" />
                                    </div>
                                )}

                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-5 py-3",
                                    msg.role === 'user'
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                        : "bg-transparent text-text-primary px-0 py-0"
                                )}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        className="prose dark:prose-invert max-w-none text-sm leading-7 break-words prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-code:text-inherit"
                                        components={{
                                            code: CodeBlock,
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-6 border border-border-color rounded-lg">
                                                    <table {...props} className="min-w-full divide-y divide-border-color" />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => (
                                                <thead {...props} className="bg-secondary" />
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th {...props} className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider" />
                                            ),
                                            td: ({ node, ...props }) => (
                                                <td {...props} className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary border-t border-border-color" />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul {...props} className="list-disc list-outside ml-4 my-4 space-y-2 text-inherit" />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol {...props} className="list-decimal list-outside ml-4 my-4 space-y-2 text-inherit" />
                                            ),
                                            li: ({ node, ...props }) => (
                                                <li {...props} className="pl-1" />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote {...props} className="border-l-2 border-zinc-500 pl-4 italic text-text-secondary my-4" />
                                            ),
                                            h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-border-color" />,
                                            h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold mt-6 mb-3" />,
                                            h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                                        }}
                                    >
                                        {msg.parts[0].text}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 border border-border-color">
                                <Bot size={16} className="text-text-primary" />
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary via-primary to-transparent pt-20 transition-colors duration-300">
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-secondary rounded-2xl border border-border-color shadow-2xl focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Gemini..."
                            className="w-full bg-transparent text-text-primary rounded-2xl px-4 py-4 pr-12 resize-none focus:outline-none max-h-[200px] min-h-[56px] scrollbar-thin scrollbar-thumb-zinc-700"
                            rows={1}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || loading}
                            className="absolute right-3 bottom-3 p-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-xs text-text-secondary">
                            Gemini can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWithGemini;