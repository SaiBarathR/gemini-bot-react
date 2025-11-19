import { MessageSquare, Settings, Moon, Sun, Github, Plus, Pin, Trash2, MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../utils/cn';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Sidebar = () => {
    const { theme, setTheme, chats, activeChatId, setActiveChatId, createChat, deleteChat, pinChat } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpenId, setMenuOpenId] = useState(null);
    const menuRef = useRef(null);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleNewChat = () => {
        createChat();
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const ChatItem = ({ chat }) => {
        const isActive = activeChatId === chat.id && location.pathname === '/';

        return (
            <div className={cn(
                "group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
                onClick={() => handleChatClick(chat.id)}
            >
                <MessageSquare size={18} className="flex-shrink-0" />
                <span className="font-medium truncate text-sm flex-1">{chat.title}</span>

                {chat.pinned && <Pin size={14} className="flex-shrink-0 rotate-45" />}

                {/* Action Menu Trigger */}
                <button
                    className={cn(
                        "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/20 transition-opacity",
                        menuOpenId === chat.id && "opacity-100"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                    }}
                >
                    <MoreVertical size={14} />
                </button>

                {/* Dropdown Menu */}
                {menuOpenId === chat.id && (
                    <div
                        ref={menuRef}
                        className="absolute right-2 top-8 z-50 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                pinChat(chat.id);
                                setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Pin size={14} />
                            {chat.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            onClick={() => {
                                deleteChat(chat.id);
                                setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    ChatItem.propTypes = {
        chat: PropTypes.object.isRequired,
    };

    const pinnedChats = chats.filter(c => c.pinned);
    const recentChats = chats.filter(c => !c.pinned);

    return (
        <div className="flex flex-col h-full w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
            <div className="p-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 px-2">
                    Gemini Bot
                </h1>
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium text-sm"
                >
                    <Plus size={18} />
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-6">
                {/* Pinned Chats */}
                {pinnedChats.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                            Pinned
                        </h3>
                        {pinnedChats.map(chat => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                )}

                {/* Recent Chats */}
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                        Recent
                    </h3>
                    {recentChats.length === 0 && pinnedChats.length === 0 ? (
                        <div className="px-3 text-sm text-gray-500 italic">No chats yet</div>
                    ) : (
                        recentChats.map(chat => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <Link
                    to="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        location.pathname === '/settings'
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                >
                    <Settings size={18} />
                    <span className="font-medium text-sm">Settings</span>
                </Link>

                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="font-medium text-sm">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                <a
                    href="https://github.com/SaiBarathR/gemini-bot-react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Github size={18} />
                    <span className="font-medium text-sm">GitHub</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
