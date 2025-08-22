import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Textarea,
    IconButton,
    Button,
    Tooltip,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Text,
    Input
} from '@chakra-ui/react';
import {
    Send,
    Square,
    Paperclip,
    Mic,
    Settings,
    Download,
    Upload,
    Trash2,
    RefreshCw,
    Sparkles,
    Zap
} from 'lucide-react';
import PropTypes from 'prop-types';

const ChatInput = ({
    onSendMessage,
    onClearChat,
    onStopGeneration,
    onExportChat,
    onImportChat,
    isLoading,
    disabled = false,
    placeholder = "What's on your mind? Let's chat! ✨",
    maxLength = 4000
}) => {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;

        onSendMessage(input.trim());
        setInput('');

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImportChat(file);
        }
    };

    const handleVoiceRecording = () => {
        // Placeholder for voice recording functionality
        setIsRecording(!isRecording);
        // TODO: Implement actual voice recording
    };

    const SettingsModal = () => (
        <Modal isOpen={isSettingsOpen} onClose={onSettingsClose}>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent className="glass-effect" borderRadius="2xl" border="none">
                <ModalHeader color="white" fontSize="xl" fontWeight="700">
                    Chat Settings ⚙️
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        <Box className="glass-effect-dark p-4 rounded-xl">
                            <Text fontWeight="700" mb={2} color="white">Model Configuration 🤖</Text>
                            <Text fontSize="sm" color="white" opacity={0.8}>
                                Current model: Gemini 2.0 Flash ⚡
                            </Text>
                        </Box>

                        <Box className="glass-effect-dark p-4 rounded-xl">
                            <Text fontWeight="700" mb={2} color="white">Temperature 🌡️</Text>
                            <Input
                                type="number"
                                min="0"
                                max="2"
                                step="0.1"
                                defaultValue="0.7"
                                placeholder="0.7"
                                bg="rgba(255, 255, 255, 0.1)"
                                border="1px solid rgba(255, 255, 255, 0.2)"
                                color="white"
                                _placeholder={{ color: "white", opacity: 0.6 }}
                                _focus={{
                                    borderColor: "purple.400",
                                    boxShadow: "0 0 0 1px purple.400"
                                }}
                            />
                            <Text fontSize="xs" color="white" opacity={0.7} mt={1}>
                                Controls randomness (0 = focused, 2 = creative)
                            </Text>
                        </Box>

                        <Box className="glass-effect-dark p-4 rounded-xl">
                            <Text fontWeight="700" mb={2} color="white">Max Tokens 📏</Text>
                            <Input
                                type="number"
                                min="1"
                                max="8192"
                                defaultValue="8192"
                                placeholder="8192"
                                bg="rgba(255, 255, 255, 0.1)"
                                border="1px solid rgba(255, 255, 255, 0.2)"
                                color="white"
                                _placeholder={{ color: "white", opacity: 0.6 }}
                                _focus={{
                                    borderColor: "purple.400",
                                    boxShadow: "0 0 0 1px purple.400"
                                }}
                            />
                            <Text fontSize="xs" color="white" opacity={0.7} mt={1}>
                                Maximum response length
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );

    return (
        <>
            <Box className="sticky bottom-0 p-4 md:p-6">
                <Box className="max-w-5xl mx-auto">
                    {/* Main input area with glass effect */}
                    <Box
                        className={`glass-effect rounded-3xl p-4 md:p-6 transition-all duration-300 ${isFocused ? 'pulse-glow' : ''
                            }`}
                        border="1px solid rgba(255, 255, 255, 0.2)"
                    >
                        <Box className="relative">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholder}
                                disabled={disabled}
                                maxLength={maxLength}
                                resize="none"
                                minH={{ base: "60px", md: "80px" }}
                                maxH="200px"
                                pr={{ base: "100px", md: "140px" }}
                                bg="transparent"
                                border="none"
                                color="white"
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="500"
                                _placeholder={{
                                    color: "white",
                                    opacity: 0.7,
                                    fontStyle: "italic"
                                }}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "none"
                                }}
                                _disabled={{
                                    opacity: 0.6,
                                    cursor: "not-allowed"
                                }}
                            />

                            {/* Character counter with fun styling */}
                            {input.length > maxLength * 0.8 && (
                                <Text
                                    fontSize={{ base: "xs", md: "sm" }}
                                    color={input.length >= maxLength ? "red.300" : "white"}
                                    opacity={0.8}
                                    position="absolute"
                                    bottom="2"
                                    right={{ base: "100px", md: "140px" }}
                                    fontWeight="600"
                                >
                                    {input.length}/{maxLength}
                                </Text>
                            )}

                            {/* Action buttons with fun styling */}
                            <HStack
                                position="absolute"
                                right="2"
                                bottom="2"
                                spacing={2}
                            >
                                {/* Attachment button */}
                                <Tooltip label="Attach file 📎" hasArrow>
                                    <IconButton
                                        size={{ base: "sm", md: "md" }}
                                        variant="ghost"
                                        icon={<Paperclip size={18} />}
                                        onClick={() => fileInputRef.current?.click()}
                                        aria-label="Attach file"
                                        color="white"
                                        className="hover-lift"
                                        _hover={{
                                            bg: 'rgba(255, 255, 255, 0.2)',
                                            transform: 'scale(1.1)'
                                        }}
                                    />
                                </Tooltip>

                                {/* Voice recording button */}
                                <Tooltip label={isRecording ? "Stop recording 🛑" : "Voice message 🎤"} hasArrow>
                                    <IconButton
                                        size={{ base: "sm", md: "md" }}
                                        variant="ghost"
                                        icon={<Mic size={18} />}
                                        onClick={handleVoiceRecording}
                                        aria-label={isRecording ? "Stop recording" : "Voice message"}
                                        color={isRecording ? "red.300" : "white"}
                                        className={`hover-lift ${isRecording ? 'pulse-glow' : ''}`}
                                        _hover={{
                                            bg: 'rgba(255, 255, 255, 0.2)',
                                            transform: 'scale(1.1)'
                                        }}
                                    />
                                </Tooltip>

                                {/* Send/Stop button */}
                                {isLoading ? (
                                    <Tooltip label="Stop generation 🛑" hasArrow>
                                        <IconButton
                                            size={{ base: "sm", md: "md" }}
                                            icon={<Square size={18} />}
                                            onClick={onStopGeneration}
                                            aria-label="Stop generation"
                                            className="fun-button hover-lift"
                                            bg="linear-gradient(45deg, #f093fb, #f5576c)"
                                            color="white"
                                            _hover={{
                                                transform: 'scale(1.1)',
                                                boxShadow: '0 5px 15px rgba(240, 147, 251, 0.4)'
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Send message 🚀" hasArrow>
                                        <IconButton
                                            size={{ base: "sm", md: "md" }}
                                            icon={<Send size={18} />}
                                            onClick={handleSend}
                                            disabled={!input.trim() || disabled}
                                            aria-label="Send message"
                                            className="fun-button hover-lift"
                                            bg={input.trim() ? "linear-gradient(45deg, #667eea, #764ba2)" : "rgba(255, 255, 255, 0.1)"}
                                            color="white"
                                            _hover={{
                                                transform: input.trim() ? 'scale(1.1)' : 'none',
                                                boxShadow: input.trim() ? '0 5px 15px rgba(102, 126, 234, 0.4)' : 'none'
                                            }}
                                            _disabled={{
                                                opacity: 0.4,
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </HStack>
                        </Box>

                        {/* Bottom toolbar with fun options */}
                        <HStack
                            mt={4}
                            justify="space-between"
                            flexWrap="wrap"
                            spacing={2}
                        >
                            <HStack spacing={2} flexWrap="wrap">
                                <Text
                                    fontSize={{ base: "xs", md: "sm" }}
                                    color="white"
                                    opacity={0.7}
                                    fontStyle="italic"
                                >
                                    Press Enter to send, Shift+Enter for new line
                                </Text>
                            </HStack>

                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    size="sm"
                                    variant="ghost"
                                    icon={<Settings size={16} />}
                                    aria-label="Chat options"
                                    color="white"
                                    className="hover-lift"
                                    _hover={{
                                        bg: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    }}
                                />
                                <MenuList className="glass-effect" borderRadius="xl" border="none">
                                    <MenuItem
                                        icon={<Settings size={16} />}
                                        onClick={onSettingsOpen}
                                        className="hover-lift"
                                        color="white"
                                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        Settings ⚙️
                                    </MenuItem>
                                    <MenuItem
                                        icon={<Download size={16} />}
                                        onClick={onExportChat}
                                        className="hover-lift"
                                        color="white"
                                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        Export Chat 📥
                                    </MenuItem>
                                    <MenuItem
                                        icon={<Upload size={16} />}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="hover-lift"
                                        color="white"
                                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        Import Chat 📤
                                    </MenuItem>
                                    <MenuItem
                                        icon={<RefreshCw size={16} />}
                                        onClick={onClearChat}
                                        className="hover-lift"
                                        color="white"
                                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        New Chat 🆕
                                    </MenuItem>
                                    <MenuItem
                                        icon={<Trash2 size={16} />}
                                        onClick={onClearChat}
                                        color="red.300"
                                        className="hover-lift"
                                        _hover={{ bg: 'rgba(255, 0, 0, 0.1)' }}
                                    >
                                        Clear Chat 🗑️
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>
                    </Box>

                    {/* Fun tip */}
                    <Text
                        textAlign="center"
                        fontSize={{ base: "xs", md: "sm" }}
                        color="white"
                        opacity={0.6}
                        mt={3}
                        fontStyle="italic"
                    >
                        💡 Pro tip: Be specific and ask follow-up questions for better responses!
                    </Text>
                </Box>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json,.txt,.md"
                    style={{ display: 'none' }}
                />
            </Box>

            <SettingsModal />
        </>
    );
};

ChatInput.propTypes = {
    onSendMessage: PropTypes.func.isRequired,
    onClearChat: PropTypes.func,
    onStopGeneration: PropTypes.func,
    onExportChat: PropTypes.func,
    onImportChat: PropTypes.func,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number
};

export default ChatInput; 