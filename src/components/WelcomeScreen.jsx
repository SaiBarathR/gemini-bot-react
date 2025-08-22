import { Box, Text, VStack, HStack, Button, SimpleGrid, Card, CardBody, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Code,
    Lightbulb,
    BookOpen,
    Calculator,
    Palette,
    Zap,
    Brain,
    Sparkles,
    Heart,
    Coffee,
    Rocket
} from 'lucide-react';
import PropTypes from 'prop-types';

const WelcomeScreen = ({ onSendMessage }) => {
    const suggestedPrompts = [
        {
            icon: Code,
            title: "Code Buddy 👨‍💻",
            prompt: "Help me write a Python function to sort a list of dictionaries by a specific key",
            category: "Programming",
            emoji: "🚀",
            gradient: "linear(to-r, #667eea, #764ba2)"
        },
        {
            icon: Lightbulb,
            title: "Story Time ✨",
            prompt: "Write a short story about a robot who discovers emotions",
            category: "Creative",
            emoji: "📚",
            gradient: "linear(to-r, #f093fb, #f5576c)"
        },
        {
            icon: BookOpen,
            title: "Explain Like I'm 5 🧠",
            prompt: "Explain quantum computing in simple terms with analogies",
            category: "Education",
            emoji: "🎓",
            gradient: "linear(to-r, #4facfe, #00f2fe)"
        },
        {
            icon: Calculator,
            title: "Money Matters 💰",
            prompt: "Help me plan a budget for a small business startup",
            category: "Analysis",
            emoji: "📊",
            gradient: "linear(to-r, #43e97b, #38f9d7)"
        },
        {
            icon: Palette,
            title: "Design Guru 🎨",
            prompt: "Suggest color palettes and design principles for a modern website",
            category: "Design",
            emoji: "🎯",
            gradient: "linear(to-r, #fa709a, #fee140)"
        },
        {
            icon: Brain,
            title: "Study Buddy 📖",
            prompt: "Create a study plan for learning machine learning in 3 months",
            category: "Education",
            emoji: "⚡",
            gradient: "linear(to-r, #a8edea, #fed6e3)"
        }
    ];

    const features = [
        {
            icon: Zap,
            title: "Lightning Fast ⚡",
            description: "Powered by Gemini 2.0 Flash",
            emoji: "🚀"
        },
        {
            icon: MessageSquare,
            title: "Super Smart 🧠",
            description: "Natural conversations that just flow",
            emoji: "💬"
        },
        {
            icon: Code,
            title: "Code Wizard 🧙‍♂️",
            description: "Debug, build, and learn together",
            emoji: "⚡"
        },
        {
            icon: Heart,
            title: "Always Here 💜",
            description: "24/7 creative problem solving",
            emoji: "🌟"
        }
    ];

    const MotionBox = motion(Box);
    const MotionCard = motion(Card);

    return (
        <Box className="min-h-screen p-4 md:p-8 overflow-y-auto">
            <VStack spacing={{ base: 6, md: 8 }} maxW="6xl" mx="auto" textAlign="center">
                {/* Header with fun animations */}
                <MotionBox
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="float-animation"
                >
                    <VStack spacing={{ base: 3, md: 4 }}>
                        <HStack spacing={4} justify="center" flexWrap="wrap">
                            <Box
                                className="glass-effect bounce-in p-4 rounded-3xl"
                                bgGradient="linear(45deg, #667eea, #764ba2)"
                            >
                                <Sparkles size={{ base: 28, md: 36 }} color="white" />
                            </Box>
                            <Text
                                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                                fontWeight="800"
                                bgGradient="linear(to-r, white, #f0f8ff)"
                                bgClip="text"
                                letterSpacing="-0.02em"
                            >
                                Hey there! 👋
                            </Text>
                        </HStack>
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="600"
                            color="white"
                            opacity={0.9}
                            maxW="3xl"
                        >
                            I'm your AI buddy powered by Gemini 2.0 ✨
                        </Text>
                        <Text
                            fontSize={{ base: "md", md: "lg" }}
                            color="white"
                            opacity={0.8}
                            maxW="2xl"
                            lineHeight="1.6"
                        >
                            Ready to chat, code, create, and have some fun? Let's dive in! 🚀
                        </Text>
                    </VStack>
                </MotionBox>

                {/* Fun features grid */}
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    w="full"
                >
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, lg: 4 }}
                        spacing={{ base: 3, md: 4 }}
                        mb={{ base: 6, md: 8 }}
                    >
                        {features.map((feature, index) => (
                            <MotionCard
                                key={feature.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.1 * index,
                                    type: "spring",
                                    bounce: 0.3
                                }}
                                className="glass-effect hover-lift cursor-fun"
                                borderRadius="2xl"
                                border="none"
                                _hover={{
                                    transform: 'translateY(-8px) scale(1.05)',
                                    bg: 'rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <CardBody textAlign="center" py={{ base: 4, md: 6 }} px={{ base: 3, md: 4 }}>
                                    <VStack spacing={3}>
                                        <Text fontSize={{ base: "2xl", md: "3xl" }}>
                                            {feature.emoji}
                                        </Text>
                                        <Text
                                            fontWeight="700"
                                            fontSize={{ base: "sm", md: "md" }}
                                            color="white"
                                        >
                                            {feature.title}
                                        </Text>
                                        <Text
                                            fontSize={{ base: "xs", md: "sm" }}
                                            color="white"
                                            opacity={0.8}
                                            lineHeight="1.4"
                                        >
                                            {feature.description}
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </MotionCard>
                        ))}
                    </SimpleGrid>
                </MotionBox>

                {/* Conversation starters with more fun */}
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    w="full"
                >
                    <VStack spacing={{ base: 4, md: 6 }}>
                        <HStack spacing={3}>
                            <Text fontSize={{ base: "2xl", md: "3xl" }}>🎯</Text>
                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="700"
                                color="white"
                            >
                                Let's start with something fun!
                            </Text>
                            <Text fontSize={{ base: "2xl", md: "3xl" }}>🎉</Text>
                        </HStack>

                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={{ base: 3, md: 4 }}
                            w="full"
                            maxW="5xl"
                        >
                            {suggestedPrompts.map((suggestion, index) => (
                                <MotionCard
                                    key={suggestion.title}
                                    initial={{ opacity: 0, rotateY: -15 }}
                                    animate={{ opacity: 1, rotateY: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.1 * index,
                                        type: "spring"
                                    }}
                                    className="glass-effect hover-lift cursor-fun"
                                    borderRadius="2xl"
                                    border="none"
                                    cursor="pointer"
                                    onClick={() => onSendMessage(suggestion.prompt)}
                                    _hover={{
                                        transform: 'translateY(-12px) scale(1.03)',
                                        bg: 'rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                >
                                    <CardBody p={{ base: 4, md: 5 }}>
                                        <VStack align="start" spacing={3}>
                                            <HStack justify="space-between" w="full">
                                                <HStack spacing={3}>
                                                    <Box
                                                        p={2}
                                                        bgGradient={suggestion.gradient}
                                                        borderRadius="xl"
                                                        className="pulse-glow"
                                                    >
                                                        <Icon as={suggestion.icon} w={4} h={4} color="white" />
                                                    </Box>
                                                    <VStack align="start" spacing={0}>
                                                        <Text
                                                            fontWeight="700"
                                                            fontSize={{ base: "sm", md: "md" }}
                                                            color="white"
                                                        >
                                                            {suggestion.title}
                                                        </Text>
                                                        <Text
                                                            fontSize={{ base: "xs", md: "sm" }}
                                                            color="white"
                                                            opacity={0.7}
                                                        >
                                                            {suggestion.category}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                                <Text fontSize={{ base: "lg", md: "xl" }}>
                                                    {suggestion.emoji}
                                                </Text>
                                            </HStack>
                                            <Text
                                                fontSize={{ base: "sm", md: "md" }}
                                                color="white"
                                                opacity={0.9}
                                                lineHeight="1.5"
                                                noOfLines={{ base: 3, md: 2 }}
                                            >
                                                {suggestion.prompt}
                                            </Text>
                                        </VStack>
                                    </CardBody>
                                </MotionCard>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </MotionBox>

                {/* Fun call to action */}
                <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.4 }}
                    className="float-animation"
                >
                    <VStack spacing={4}>
                        <HStack spacing={2} flexWrap="wrap" justify="center">
                            <Text fontSize={{ base: "lg", md: "xl" }} color="white" opacity={0.9}>
                                Or just type anything below
                            </Text>
                            <HStack spacing={1}>
                                <Text fontSize={{ base: "xl", md: "2xl" }}>👇</Text>
                                <Text fontSize={{ base: "xl", md: "2xl" }}>✨</Text>
                                <Text fontSize={{ base: "xl", md: "2xl" }}>🚀</Text>
                            </HStack>
                        </HStack>
                        <Text
                            fontSize={{ base: "sm", md: "md" }}
                            color="white"
                            opacity={0.7}
                            fontStyle="italic"
                        >
                            I'm here to help with anything you need! 💜
                        </Text>
                    </VStack>
                </MotionBox>
            </VStack>
        </Box>
    );
};

WelcomeScreen.propTypes = {
    onSendMessage: PropTypes.func.isRequired,
};

export default WelcomeScreen; 