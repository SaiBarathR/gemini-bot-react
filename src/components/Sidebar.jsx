import { MessageSquare, Settings, Moon, Sun, Github, Plus, Pin, Trash2, MoreVertical, PanelLeftClose, PanelLeft } from 'lucide-react';
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const menuRef = useRef(null);

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('midnight');
        else setTheme('dark');
    };

    const getThemeIcon = () => {
        if (theme === 'light') return <Sun size={18} />;
        if (theme === 'dark') return <Moon size={18} />;
        return <Moon size={18} className="fill-current" />; // Filled moon for midnight
    };

    const getThemeLabel = () => {
        if (theme === 'light') return 'Light Mode';
        if (theme === 'dark') return 'Dark Mode';
        return 'Midnight Mode';
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
                "group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
                isActive
                    ? "bg-zinc-800 text-white"
                    : "text-text-secondary hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-text-primary"
            )}
                onClick={() => handleChatClick(chat.id)}
            >
                <MessageSquare size={16} className="flex-shrink-0" />
                {!isCollapsed && (
                    <>
                        <span className="font-medium truncate text-sm flex-1">{chat.title}</span>

                        {chat.pinned && <Pin size={12} className="flex-shrink-0 rotate-45 text-text-secondary" />}

                        {/* Action Menu Trigger */}
                        <button
                            className={cn(
                                "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-opacity",
                                menuOpenId === chat.id && "opacity-100"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                            }}
                        >
                            <MoreVertical size={14} />
                        </button>
                    </>
                )}

                {/* Dropdown Menu */}
                {menuOpenId === chat.id && !isCollapsed && (
                    <div
                        ref={menuRef}
                        className="absolute right-2 top-8 z-50 w-32 bg-secondary rounded-lg shadow-xl border border-border-color overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                pinChat(chat.id);
                                setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                            <Pin size={14} />
                            {chat.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            onClick={() => {
                                deleteChat(chat.id);
                                setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
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
        <div className={cn(
            "flex flex-col h-full bg-secondary border-r border-border-color flex-shrink-0 transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            <div className="p-4 flex items-center justify-between">
                {!isCollapsed && (
                    <h1 className="text-lg font-bold text-text-primary px-2 tracking-tight">
                        Gemini
                    </h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            <div className="px-3 mb-4">
                <button
                    onClick={handleNewChat}
                    className={cn(
                        "w-full flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm",
                        isCollapsed ? "justify-center px-0" : "px-4"
                    )}
                >
                    <Plus size={18} />
                    {!isCollapsed && "New Chat"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                {/* Pinned Chats */}
                {pinnedChats.length > 0 && (
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
                                Pinned
                            </h3>
                        )}
                        {pinnedChats.map(chat => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                )}

                {/* Recent Chats */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
                            Recent
                        </h3>
                    )}
                    {recentChats.length === 0 && pinnedChats.length === 0 ? (
                        !isCollapsed && <div className="px-3 text-sm text-text-secondary italic">No chats yet</div>
                    ) : (
                        recentChats.map(chat => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-border-color space-y-1">
                <Link
                    to="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        location.pathname === '/settings'
                            ? "bg-zinc-800 text-white"
                            : "text-text-secondary hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-text-primary",
                        isCollapsed && "justify-center"
                    )}
                    title="Settings"
                >
                    <Settings size={18} />
                    {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                </Link>

                <button
                    onClick={toggleTheme}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 w-full rounded-lg text-text-secondary hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-text-primary transition-colors",
                        isCollapsed && "justify-center"
                    )}
                    title="Toggle Theme"
                >
                    {getThemeIcon()}
                    {!isCollapsed && (
                        <span className="font-medium text-sm">
                            {getThemeLabel()}
                        </span>
                    )}
                </button>

                <a
                    href="https://github.com/SaiBarathR/gemini-bot-react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 w-full rounded-lg text-text-secondary hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-text-primary transition-colors",
                        isCollapsed && "justify-center"
                    )}
                    title="GitHub"
                >
                    <Github size={18} />
                    {!isCollapsed && <span className="font-medium text-sm">GitHub</span>}
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
