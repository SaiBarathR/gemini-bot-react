import { Box, Text, IconButton, Tooltip, useClipboard, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { Copy, MoreVertical, RefreshCw, Edit, Trash2, User, Bot, Heart, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';

const MessageBubble = ({
    message,
    isStreaming = false,
    onEdit,
    onDelete,
    onRegenerate,
    showActions = true
}) => {
    const { hasCopied, onCopy } = useClipboard(message.content);
    const isUser = message.role === 'user';
    const isModel = message.role === 'model';

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const TypingIndicator = () => (
        <Box className="flex items-center space-x-2 py-3">
            <Box className="flex space-x-1">
                <Box className="dot" />
                <Box className="dot" />
                <Box className="dot" />
            </Box>
            <Text fontSize={{ base: "sm", md: "md" }} color="white" opacity={0.8} fontWeight="500">
                AI is cooking something awesome... 🍳✨
            </Text>
        </Box>
    );

    const MessageActions = () => (
        <Box className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Tooltip label={hasCopied ? "Copied! 🎉" : "Copy message"} hasArrow>
                <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<Copy size={16} />}
                    onClick={() => onCopy()}
                    aria-label="Copy message"
                    className="hover-lift"
                    _hover={{
                        bg: isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.1)',
                        transform: 'scale(1.1)'
                    }}
                    color={isUser ? 'white' : 'gray.600'}
                />
            </Tooltip>

            {showActions && (
                <Menu>
                    <MenuButton
                        as={IconButton}
                        size="sm"
                        variant="ghost"
                        icon={<MoreVertical size={16} />}
                        aria-label="Message options"
                        className="hover-lift"
                        _hover={{
                            bg: isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.1)',
                            transform: 'scale(1.1)'
                        }}
                        color={isUser ? 'white' : 'gray.600'}
                    />
                    <MenuList className="glass-effect" borderRadius="xl" border="none">
                        {isUser && onEdit && (
                            <MenuItem
                                icon={<Edit size={16} />}
                                onClick={() => onEdit(message.id, message.content)}
                                className="hover-lift"
                                _hover={{ bg: 'rgba(102, 126, 234, 0.1)' }}
                            >
                                Edit message ✏️
                            </MenuItem>
                        )}
                        {isModel && onRegenerate && (
                            <MenuItem
                                icon={<RefreshCw size={16} />}
                                onClick={() => onRegenerate()}
                                className="hover-lift"
                                _hover={{ bg: 'rgba(102, 126, 234, 0.1)' }}
                            >
                                Regenerate response 🔄
                            </MenuItem>
                        )}
                        {onDelete && (
                            <MenuItem
                                icon={<Trash2 size={16} />}
                                onClick={() => onDelete(message.id)}
                                color="red.500"
                                className="hover-lift"
                                _hover={{ bg: 'rgba(255, 0, 0, 0.1)' }}
                            >
                                Delete message 🗑️
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            )}
        </Box>
    );

    const MessageHeader = () => (
        <Box className="flex items-center space-x-3 mb-3">
            <Box
                className={`p-2 rounded-full glass-effect ${isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
            >
                {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
            </Box>
            <Box>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color="white">
                    {isUser ? 'You 😊' : 'Gemini 🤖'}
                </Text>
                {message.timestamp && (
                    <Text fontSize={{ base: "xs", md: "sm" }} color="white" opacity={0.7}>
                        {formatTimestamp(message.timestamp)}
                    </Text>
                )}
            </Box>
        </Box>
    );

    const CodeBlock = ({ language, children }) => (
        <Box className="my-3 rounded-xl overflow-hidden">
            <SyntaxHighlighter
                style={isUser ? oneDark : oneLight}
                language={language}
                PreTag="div"
                className="rounded-xl"
                customStyle={{
                    margin: 0,
                    borderRadius: '12px',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </Box>
    );

    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0.3
            }}
            className={`group w-full max-w-5xl mx-auto my-6 px-4 ${isUser ? 'ml-auto' : 'mr-auto'}`}
        >
            <Box className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <Box className={`max-w-[85%] md:max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                    {!isUser && <MessageHeader />}

                    <Box
                        className={`relative p-4 md:p-6 rounded-3xl shadow-lg hover-lift ${isUser
                                ? 'message-bubble-user'
                                : 'message-bubble-ai'
                            }`}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        {/* Fun decorative elements */}
                        {!isUser && (
                            <Box
                                position="absolute"
                                top={2}
                                right={2}
                                opacity={0.3}
                                className="float-animation"
                            >
                                <Sparkles size={16} color="purple" />
                            </Box>
                        )}

                        {isStreaming && !message.content ? (
                            <TypingIndicator />
                        ) : (
                            <Box className="prose prose-sm max-w-none">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <CodeBlock language={match[1]}>
                                                    {children}
                                                </CodeBlock>
                                            ) : (
                                                <code
                                                    className={`${isUser
                                                            ? 'bg-white bg-opacity-20 text-white'
                                                            : 'bg-purple-100 text-purple-800'
                                                        } px-2 py-1 rounded-lg text-sm font-mono`}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: ({ children }) => (
                                            <Text
                                                className={`${isUser ? 'text-white' : 'text-gray-800'
                                                    } leading-relaxed`}
                                                fontSize={{ base: "sm", md: "md" }}
                                                lineHeight="1.6"
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        ul: ({ children }) => (
                                            <Box as="ul" className="list-disc list-inside space-y-2 ml-4 my-3">
                                                {children}
                                            </Box>
                                        ),
                                        ol: ({ children }) => (
                                            <Box as="ol" className="list-decimal list-inside space-y-2 ml-4 my-3">
                                                {children}
                                            </Box>
                                        ),
                                        li: ({ children }) => (
                                            <Text
                                                as="li"
                                                className={isUser ? 'text-white' : 'text-gray-700'}
                                                fontSize={{ base: "sm", md: "md" }}
                                                lineHeight="1.5"
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        blockquote: ({ children }) => (
                                            <Box
                                                className={`border-l-4 pl-4 py-3 my-3 rounded-r-lg ${isUser
                                                        ? 'border-white border-opacity-50 bg-white bg-opacity-10'
                                                        : 'border-purple-400 bg-purple-50'
                                                    }`}
                                            >
                                                {children}
                                            </Box>
                                        ),
                                        h1: ({ children }) => (
                                            <Text
                                                fontSize={{ base: "lg", md: "xl" }}
                                                fontWeight="bold"
                                                className={isUser ? 'text-white' : 'text-gray-800'}
                                                my={3}
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        h2: ({ children }) => (
                                            <Text
                                                fontSize={{ base: "md", md: "lg" }}
                                                fontWeight="semibold"
                                                className={isUser ? 'text-white' : 'text-gray-800'}
                                                my={2}
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        h3: ({ children }) => (
                                            <Text
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontWeight="semibold"
                                                className={isUser ? 'text-white' : 'text-gray-800'}
                                                my={2}
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        strong: ({ children }) => (
                                            <Text
                                                as="strong"
                                                fontWeight="bold"
                                                className={isUser ? 'text-white' : 'text-gray-900'}
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        em: ({ children }) => (
                                            <Text
                                                as="em"
                                                fontStyle="italic"
                                                className={isUser ? 'text-white text-opacity-90' : 'text-gray-700'}
                                            >
                                                {children}
                                            </Text>
                                        ),
                                        a: ({ children, href }) => (
                                            <Text
                                                as="a"
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`${isUser
                                                        ? 'text-white underline hover:text-blue-200'
                                                        : 'text-blue-600 hover:text-blue-800'
                                                    } transition-colors duration-200`}
                                                fontWeight="500"
                                            >
                                                {children}
                                            </Text>
                                        )
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </Box>
                        )}

                        {/* Message actions */}
                        <Box className="absolute top-2 right-2">
                            <MessageActions />
                        </Box>
                    </Box>

                    {/* User message header (shown below the message) */}
                    {isUser && (
                        <Box className="flex items-center justify-end space-x-2 mt-2 mr-4">
                            <Text fontSize={{ base: "xs", md: "sm" }} color="white" opacity={0.7}>
                                You
                            </Text>
                            {message.timestamp && (
                                <Text fontSize={{ base: "xs", md: "sm" }} color="white" opacity={0.5}>
                                    {formatTimestamp(message.timestamp)}
                                </Text>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

MessageBubble.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        timestamp: PropTypes.string
    }).isRequired,
    isStreaming: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onRegenerate: PropTypes.func,
    showActions: PropTypes.bool
};

export default MessageBubble; 