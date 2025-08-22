/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
    Box,
    VStack,
    Container,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useToast,
    Spinner,
    Text,
    HStack,
    IconButton,
    Tooltip,
    useDisclosure,
    Badge
} from "@chakra-ui/react";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, WifiOff, Menu, Settings, MessageSquare, Plus } from 'lucide-react';

import useGemini from "../hooks/useGemini";
import useConversationManager from "../hooks/useConversationManager";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import ConversationSidebar from "./ConversationSidebar";
import AdvancedSettings from "./AdvancedSettings";

const ChatWithGemini = () => {
    // Conversation management
    const {
        conversations,
        currentConversationId,
        currentConversation,
        createConversation,
        selectConversation,
        deleteConversation,
        renameConversation,
        clearConversation,
        addMessageToConversation,
        updateMessageInConversation,
        deleteMessageFromConversation,
        exportConversation,
        getStatistics
    } = useConversationManager();

    // Settings management
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('gemini_chat_settings');
            return saved ? JSON.parse(saved) : {
                model: 'gemini-2.0-flash',
                temperature: 0.7,
                maxTokens: 8192,
                topP: 0.8,
                systemPrompt: '',
                enableSystemPrompt: false,
                streamingEnabled: true,
                showTimestamps: true,
                showWordCount: false,
                autoScroll: true,
                darkMode: false,
                fontSize: 'medium',
                codeTheme: 'oneDark'
            };
        } catch {
            return {
                model: 'gemini-2.0-flash',
                temperature: 0.7,
                maxTokens: 8192,
                topP: 0.8,
                systemPrompt: '',
                enableSystemPrompt: false,
                streamingEnabled: true,
                showTimestamps: true,
                showWordCount: false,
                autoScroll: true,
                darkMode: false,
                fontSize: 'medium',
                codeTheme: 'oneDark'
            };
        }
    });

    // UI state
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const toast = useToast();

    // Modals and drawers
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
    const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

    // Gemini hook with current conversation
    const {
        loading,
        error,
        isTyping,
        streamingMessageId,
        sendMessage,
        stopGeneration,
        regenerateResponse,
        editMessage,
        exportChat,
        importChat
    } = useGemini();

    // Get current conversation messages
    const messages = currentConversation?.messages || [];
    const hasMessages = messages.length > 0;

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        if (settings.autoScroll) {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, settings.autoScroll]);

    // Handle online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast({
                title: "Connection restored",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast({
                title: "Connection lost",
                description: "You're offline. Messages will be sent when connection is restored.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [toast]);

    // Handle message sending
    const handleSendMessage = async (message) => {
        if (!isOnline) {
            toast({
                title: "No internet connection",
                description: "Please check your connection and try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!currentConversationId) return;

        try {
            // Add user message to conversation
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            };

            addMessageToConversation(currentConversationId, userMessage);

            // Send message and get AI response
            await sendMessage(message, {
                conversationId: currentConversationId,
                settings: settings,
                onMessageUpdate: (content) => {
                    // Update the AI message in the conversation
                    const aiMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'model',
                        content: content,
                        timestamp: new Date().toISOString()
                    };
                    addMessageToConversation(currentConversationId, aiMessage);
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Failed to send message",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Handle settings change
    const handleSettingsChange = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('gemini_chat_settings', JSON.stringify(newSettings));
    };

    // Handle new conversation
    const handleNewConversation = () => {
        createConversation();
        onSidebarClose();
    };

    // Handle conversation selection
    const handleSelectConversation = (conversationId) => {
        selectConversation(conversationId);
        onSidebarClose();
    };

    // Handle clear chat
    const handleClearChat = () => {
        if (currentConversationId) {
            clearConversation(currentConversationId);
            toast({
                title: "Conversation cleared",
                status: "info",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Handle message deletion
    const handleDeleteMessage = (messageId) => {
        if (currentConversationId) {
            deleteMessageFromConversation(currentConversationId, messageId);
            toast({
                title: "Message deleted",
                status: "info",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Handle message editing
    const handleEditMessage = async (messageId, newContent) => {
        if (currentConversationId) {
            try {
                updateMessageInConversation(currentConversationId, messageId, { content: newContent });
                // Re-send from this point
                await editMessage(messageId, newContent);
            } catch (error) {
                toast({
                    title: "Failed to edit message",
                    description: "Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    // Handle export conversation
    const handleExportConversation = (conversationId) => {
        try {
            exportConversation(conversationId, settings.exportFormat || 'json');
            toast({
                title: "Conversation exported",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to export conversation",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Handle chat export (current conversation)
    const handleExportChat = () => {
        if (currentConversationId) {
            handleExportConversation(currentConversationId);
        }
    };

    // Handle chat import
    const handleImportChat = async (file) => {
        try {
            await importChat(file);
            toast({
                title: "Chat imported successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to import chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const ConnectionStatus = () => (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert status="warning" mb={4} borderRadius="xl" className="glass-effect" border="none">
                        <AlertIcon as={WifiOff} color="orange.300" />
                        <Box>
                            <AlertTitle color="white" fontWeight="700">You're offline! 📡</AlertTitle>
                            <AlertDescription color="white" opacity={0.9}>
                                No worries! Messages will be sent when you're back online ✨
                            </AlertDescription>
                        </Box>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const ErrorAlert = () => (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert status="error" mb={4} borderRadius="xl" className="glass-effect" border="none">
                        <AlertIcon as={AlertTriangle} color="red.300" />
                        <Box>
                            <AlertTitle color="white" fontWeight="700">Oops! Something went wrong 😅</AlertTitle>
                            <AlertDescription color="white" opacity={0.9}>{error}</AlertDescription>
                        </Box>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const LoadingIndicator = () => (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <HStack
                        justify="center"
                        p={4}
                        className="glass-effect"
                        borderRadius="xl"
                        mb={4}
                    >
                        <Box className="flex space-x-1">
                            <Box className="dot" />
                            <Box className="dot" />
                            <Box className="dot" />
                        </Box>
                        <Text fontSize={{ base: "sm", md: "md" }} color="white" fontWeight="600">
                            {isTyping ? "AI is cooking up something awesome... 🧠✨" : "Working on it... 🚀"}
                        </Text>
                    </HStack>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const stats = getStatistics();

    return (
        <Box className="flex flex-col h-screen overflow-hidden">
            {/* Header with glass effect */}
            <Box className="glass-effect border-b border-white border-opacity-20 px-4 py-3 md:px-6 md:py-4">
                <Container maxW="6xl">
                    <HStack justify="space-between" align="center" flexWrap="wrap" spacing={3}>
                        <HStack spacing={3} minW="0" flex="1">
                            <Tooltip label="Conversations 💬" hasArrow>
                                <IconButton
                                    size={{ base: "sm", md: "md" }}
                                    variant="ghost"
                                    icon={<Menu size={18} />}
                                    onClick={onSidebarOpen}
                                    color="white"
                                    className="hover-lift"
                                    _hover={{
                                        bg: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    }}
                                />
                            </Tooltip>
                            <Box className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                            <Text
                                fontWeight="700"
                                color="white"
                                fontSize={{ base: "md", md: "lg" }}
                                isTruncated
                                maxW={{ base: "150px", md: "300px" }}
                            >
                                {currentConversation?.title || 'Gemini AI Chat 🤖'}
                            </Text>
                            {currentConversation?.starred && (
                                <Badge
                                    colorScheme="yellow"
                                    size="sm"
                                    className="bounce-in"
                                    borderRadius="full"
                                >
                                    ⭐
                                </Badge>
                            )}
                        </HStack>

                        <HStack spacing={2} flexShrink={0}>
                            <Tooltip label="New conversation ✨" hasArrow>
                                <IconButton
                                    size={{ base: "sm", md: "md" }}
                                    variant="ghost"
                                    icon={<Plus size={16} />}
                                    onClick={handleNewConversation}
                                    color="white"
                                    className="hover-lift"
                                    _hover={{
                                        bg: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    }}
                                />
                            </Tooltip>
                            <Tooltip label="Settings ⚙️" hasArrow>
                                <IconButton
                                    size={{ base: "sm", md: "md" }}
                                    variant="ghost"
                                    icon={<Settings size={16} />}
                                    onClick={onSettingsOpen}
                                    color="white"
                                    className="hover-lift"
                                    _hover={{
                                        bg: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    }}
                                />
                            </Tooltip>
                            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
                                {isOnline ? (
                                    <Tooltip label="Online 🌐" hasArrow>
                                        <Box>
                                            <Wifi size={16} className="text-green-400" />
                                        </Box>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Offline 📡" hasArrow>
                                        <Box>
                                            <WifiOff size={16} className="text-red-400" />
                                        </Box>
                                    </Tooltip>
                                )}
                                <Text fontSize="sm" color="white" opacity={0.8} fontWeight="500">
                                    {messages.length} {messages.length === 1 ? 'message' : 'messages'} 📝
                                </Text>
                            </HStack>
                        </HStack>
                    </HStack>
                </Container>
            </Box>

            {/* Main chat area */}
            <Box className="flex-1 overflow-hidden relative">
                <Container maxW="6xl" h="full" py={{ base: 2, md: 4 }} px={{ base: 2, md: 4 }}>
                    <VStack spacing={0} h="full">
                        {/* Connection and error alerts */}
                        <Box w="full" px={{ base: 2, md: 4 }}>
                            <ConnectionStatus />
                            <ErrorAlert />
                        </Box>

                        {/* Messages area */}
                        <Box
                            ref={containerRef}
                            className="flex-1 w-full overflow-y-auto"
                            px={{ base: 1, md: 2 }}
                        >
                            {!hasMessages ? (
                                <WelcomeScreen onSendMessage={handleSendMessage} />
                            ) : (
                                <VStack spacing={{ base: 3, md: 4 }} align="stretch" pb={4}>
                                    <AnimatePresence mode="popLayout">
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <MessageBubble
                                                    message={message}
                                                    isStreaming={streamingMessageId === message.id}
                                                    onEdit={handleEditMessage}
                                                    onDelete={handleDeleteMessage}
                                                    onRegenerate={regenerateResponse}
                                                    showActions={true}
                                                    settings={settings}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <LoadingIndicator />

                                    {/* Scroll anchor */}
                                    <div ref={messagesEndRef} />
                                </VStack>
                            )}
                        </Box>
                    </VStack>
                </Container>
            </Box>

            {/* Chat input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                onStopGeneration={stopGeneration}
                onExportChat={handleExportChat}
                onImportChat={handleImportChat}
                isLoading={loading}
                disabled={!isOnline}
                placeholder={
                    !isOnline
                        ? "You're offline! Come back online to chat 📡"
                        : "What's on your mind? Let's chat! ✨"
                }
                settings={settings}
            />

            {/* Conversation Sidebar */}
            <ConversationSidebar
                isOpen={isSidebarOpen}
                onClose={onSidebarClose}
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={deleteConversation}
                onRenameConversation={renameConversation}
                onExportConversation={handleExportConversation}
            />

            {/* Advanced Settings */}
            <AdvancedSettings
                isOpen={isSettingsOpen}
                onClose={onSettingsClose}
                settings={settings}
                onSettingsChange={handleSettingsChange}
            />
        </Box>
    );
};

export default ChatWithGemini;