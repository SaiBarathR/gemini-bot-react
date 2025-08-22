import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    IconButton,
    Button,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    Tooltip,
    Divider,
    Badge,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Download,
    Calendar,
    Clock,
    Star,
    Archive,
    Filter,
    Sparkles,
    Heart,
    Zap
} from 'lucide-react';
import PropTypes from 'prop-types';

const ConversationSidebar = ({
    isOpen,
    onClose,
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onRenameConversation,
    onExportConversation
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [filterBy, setFilterBy] = useState('all'); // all, today, week, month, starred
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const toast = useToast();

    // Filter conversations based on search and filter criteria
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.preview.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        const now = new Date();
        const convDate = new Date(conv.updatedAt);

        switch (filterBy) {
            case 'today':
                return now.toDateString() === convDate.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return convDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return convDate >= monthAgo;
            case 'starred':
                return conv.starred;
            default:
                return true;
        }
    });

    // Group conversations by date
    const groupedConversations = filteredConversations.reduce((groups, conv) => {
        const date = new Date(conv.updatedAt);
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        let groupKey;
        if (date.toDateString() === today.toDateString()) {
            groupKey = 'Today 🌟';
        } else if (date.toDateString() === yesterday.toDateString()) {
            groupKey = 'Yesterday 📅';
        } else if (date >= weekAgo) {
            groupKey = 'This Week 🗓️';
        } else {
            groupKey = 'Older 📚';
        }

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(conv);
        return groups;
    }, {});

    const handleRename = (id, newName) => {
        if (newName.trim()) {
            onRenameConversation(id, newName.trim());
            toast({
                title: "Conversation renamed! ✨",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }
        setEditingId(null);
        setEditingName('');
    };

    const handleDelete = (id) => {
        onDeleteConversation(id);
        setDeleteConfirm(null);
        toast({
            title: "Conversation deleted! 🗑️",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now ⚡';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago ⏰`;
        } else {
            return date.toLocaleDateString() + ' 📅';
        }
    };

    const ConversationItem = ({ conversation }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, type: "spring" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Box
                p={4}
                borderRadius="2xl"
                cursor="pointer"
                className={`glass-effect hover-lift transition-all duration-300 ${currentConversationId === conversation.id
                        ? 'bg-white bg-opacity-20 border-2 border-white border-opacity-30'
                        : 'bg-white bg-opacity-10 border border-white border-opacity-20'
                    }`}
                _hover={{
                    bg: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}
                onClick={() => onSelectConversation(conversation.id)}
                position="relative"
                className="group"
                mb={3}
            >
                <HStack justify="space-between" align="start" spacing={3}>
                    <VStack align="start" spacing={2} flex={1} minW={0}>
                        {editingId === conversation.id ? (
                            <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={() => handleRename(conversation.id, editingName)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRename(conversation.id, editingName);
                                    } else if (e.key === 'Escape') {
                                        setEditingId(null);
                                        setEditingName('');
                                    }
                                }}
                                size="sm"
                                autoFocus
                                bg="rgba(255, 255, 255, 0.2)"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                color="white"
                                _placeholder={{ color: "white", opacity: 0.7 }}
                                _focus={{
                                    borderColor: "purple.400",
                                    boxShadow: "0 0 0 1px purple.400"
                                }}
                            />
                        ) : (
                            <HStack spacing={2} w="full">
                                <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="white"
                                    isTruncated
                                    maxW="200px"
                                >
                                    {conversation.title}
                                </Text>
                                {conversation.starred && (
                                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                                )}
                            </HStack>
                        )}

                        <Text
                            fontSize="xs"
                            color="white"
                            opacity={0.8}
                            isTruncated
                            maxW="200px"
                        >
                            {conversation.preview}
                        </Text>

                        <HStack spacing={2}>
                            <Text fontSize="xs" color="white" opacity={0.6}>
                                {formatTime(conversation.updatedAt)}
                            </Text>
                            <Badge
                                size="sm"
                                colorScheme="purple"
                                variant="subtle"
                                borderRadius="full"
                                className="bounce-in"
                            >
                                {conversation.messageCount || 0} msgs
                            </Badge>
                        </HStack>
                    </VStack>

                    <Menu>
                        <MenuButton
                            as={IconButton}
                            size="sm"
                            variant="ghost"
                            icon={<MoreVertical size={14} />}
                            aria-label="Conversation options"
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            color="white"
                            className="hover-lift"
                            _hover={{
                                bg: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.1)'
                            }}
                        />
                        <MenuList className="glass-effect" borderRadius="xl" border="none">
                            <MenuItem
                                icon={<Edit2 size={14} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingId(conversation.id);
                                    setEditingName(conversation.title);
                                }}
                                className="hover-lift"
                                color="white"
                                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                Rename ✏️
                            </MenuItem>
                            <MenuItem
                                icon={<Star size={14} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Toggle starred status
                                }}
                                className="hover-lift"
                                color="white"
                                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                {conversation.starred ? 'Unstar ⭐' : 'Star ⭐'}
                            </MenuItem>
                            <MenuItem
                                icon={<Download size={14} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExportConversation(conversation.id);
                                }}
                                className="hover-lift"
                                color="white"
                                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                Export 📥
                            </MenuItem>
                            <MenuItem
                                icon={<Trash2 size={14} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm(conversation.id);
                                }}
                                color="red.300"
                                className="hover-lift"
                                _hover={{ bg: 'rgba(255, 0, 0, 0.1)' }}
                            >
                                Delete 🗑️
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Box>
        </motion.div>
    );

    const FilterButton = ({ filter, label, emoji, isActive, onClick }) => (
        <Button
            size="sm"
            variant={isActive ? "solid" : "ghost"}
            onClick={onClick}
            className={`hover-lift ${isActive ? 'fun-button' : ''}`}
            bg={isActive ? "linear-gradient(45deg, #667eea, #764ba2)" : "rgba(255, 255, 255, 0.1)"}
            color="white"
            _hover={{
                bg: isActive ? "linear-gradient(45deg, #764ba2, #667eea)" : "rgba(255, 255, 255, 0.2)",
                transform: 'scale(1.05)'
            }}
            leftIcon={<Text fontSize="sm">{emoji}</Text>}
            borderRadius="full"
        >
            {label}
        </Button>
    );

    const DeleteConfirmDialog = () => (
        <AlertDialog
            isOpen={deleteConfirm !== null}
            onClose={() => setDeleteConfirm(null)}
            leastDestructiveRef={undefined}
        >
            <AlertDialogOverlay backdropFilter="blur(10px)" />
            <AlertDialogContent className="glass-effect" borderRadius="2xl" border="none">
                <AlertDialogHeader fontSize="lg" fontWeight="700" color="white">
                    Delete Conversation? 🗑️
                </AlertDialogHeader>
                <AlertDialogBody color="white" opacity={0.9}>
                    Are you sure you want to delete this conversation? This action cannot be undone! 😢
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        onClick={() => setDeleteConfirm(null)}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => handleDelete(deleteConfirm)}
                        ml={3}
                        className="fun-button"
                        bg="linear-gradient(45deg, #f093fb, #f5576c)"
                        _hover={{
                            bg: "linear-gradient(45deg, #f5576c, #f093fb)",
                            transform: 'scale(1.05)'
                        }}
                    >
                        Delete 💥
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
                <DrawerOverlay backdropFilter="blur(10px)" />
                <DrawerContent className="glass-effect-dark" borderRadius="0 2xl 2xl 0">
                    <DrawerCloseButton color="white" size="lg" />
                    <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.1)">
                        <HStack spacing={3}>
                            <Box className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                <MessageSquare size={20} color="white" />
                            </Box>
                            <Text fontSize="xl" fontWeight="700" color="white">
                                Conversations 💬
                            </Text>
                        </HStack>
                    </DrawerHeader>

                    <DrawerBody p={0}>
                        <VStack spacing={4} p={4} h="full">
                            {/* New conversation button */}
                            <Button
                                leftIcon={<Plus size={16} />}
                                onClick={onNewConversation}
                                w="full"
                                className="fun-button hover-lift"
                                bg="linear-gradient(45deg, #667eea, #764ba2)"
                                color="white"
                                _hover={{
                                    bg: "linear-gradient(45deg, #764ba2, #667eea)",
                                    transform: 'scale(1.02)'
                                }}
                                borderRadius="xl"
                                size="lg"
                            >
                                New Chat ✨
                            </Button>

                            {/* Search bar */}
                            <Box position="relative" w="full">
                                <Input
                                    placeholder="Search conversations... 🔍"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    bg="rgba(255, 255, 255, 0.1)"
                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                    borderRadius="xl"
                                    color="white"
                                    _placeholder={{ color: "white", opacity: 0.7 }}
                                    _focus={{
                                        borderColor: "purple.400",
                                        boxShadow: "0 0 0 1px purple.400"
                                    }}
                                />
                                <Search
                                    size={18}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-60"
                                />
                            </Box>

                            {/* Filter buttons */}
                            <HStack spacing={2} w="full" flexWrap="wrap" justify="center">
                                <FilterButton
                                    filter="all"
                                    label="All"
                                    emoji="📝"
                                    isActive={filterBy === 'all'}
                                    onClick={() => setFilterBy('all')}
                                />
                                <FilterButton
                                    filter="today"
                                    label="Today"
                                    emoji="⚡"
                                    isActive={filterBy === 'today'}
                                    onClick={() => setFilterBy('today')}
                                />
                                <FilterButton
                                    filter="starred"
                                    label="Starred"
                                    emoji="⭐"
                                    isActive={filterBy === 'starred'}
                                    onClick={() => setFilterBy('starred')}
                                />
                            </HStack>

                            {/* Conversations list */}
                            <VStack spacing={0} w="full" flex={1} overflowY="auto" pr={2}>
                                {Object.keys(groupedConversations).length === 0 ? (
                                    <VStack spacing={4} py={8}>
                                        <Text fontSize="6xl">🤖</Text>
                                        <Text color="white" opacity={0.8} textAlign="center">
                                            {searchTerm ? 'No conversations found 🔍' : 'No conversations yet! Start chatting! 💬'}
                                        </Text>
                                    </VStack>
                                ) : (
                                    Object.entries(groupedConversations).map(([groupName, convs]) => (
                                        <Box key={groupName} w="full" mb={6}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="700"
                                                color="white"
                                                opacity={0.8}
                                                mb={3}
                                                px={2}
                                            >
                                                {groupName}
                                            </Text>
                                            <AnimatePresence>
                                                {convs.map((conv) => (
                                                    <ConversationItem key={conv.id} conversation={conv} />
                                                ))}
                                            </AnimatePresence>
                                        </Box>
                                    ))
                                )}
                            </VStack>

                            {/* Stats */}
                            <Box w="full" p={3} className="glass-effect" borderRadius="xl">
                                <HStack justify="space-between">
                                    <VStack spacing={0} align="start">
                                        <Text fontSize="xs" color="white" opacity={0.7}>
                                            Total Conversations
                                        </Text>
                                        <Text fontSize="lg" fontWeight="700" color="white">
                                            {conversations.length} 💬
                                        </Text>
                                    </VStack>
                                    <VStack spacing={0} align="end">
                                        <Text fontSize="xs" color="white" opacity={0.7}>
                                            Starred
                                        </Text>
                                        <Text fontSize="lg" fontWeight="700" color="white">
                                            {conversations.filter(c => c.starred).length} ⭐
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <DeleteConfirmDialog />
        </>
    );
};

ConversationSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    conversations: PropTypes.array.isRequired,
    currentConversationId: PropTypes.string,
    onSelectConversation: PropTypes.func.isRequired,
    onNewConversation: PropTypes.func.isRequired,
    onDeleteConversation: PropTypes.func.isRequired,
    onRenameConversation: PropTypes.func.isRequired,
    onExportConversation: PropTypes.func.isRequired
};

export default ConversationSidebar; 