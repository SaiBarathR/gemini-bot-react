import { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Input,
    Textarea,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Select,
    Switch,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Box,
    Divider,
    Badge,
    useToast,
    FormControl,
    FormLabel,
    FormHelperText,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Code,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { Settings, Zap, Brain, Palette, Code2, FileText, Globe } from 'lucide-react';
import PropTypes from 'prop-types';

const AdvancedSettings = ({ isOpen, onClose, settings, onSettingsChange }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const toast = useToast();

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onSettingsChange(localSettings);
        localStorage.setItem('gemini_chat_settings', JSON.stringify(localSettings));
        toast({
            title: "Settings saved",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
        onClose();
    };

    const handleReset = () => {
        const defaultSettings = {
            model: 'gemini-2.0-flash',
            temperature: 0.7,
            maxTokens: 8192,
            topP: 0.8,
            topK: 40,
            systemPrompt: '',
            enableSystemPrompt: false,
            streamingEnabled: true,
            autoSave: true,
            darkMode: false,
            fontSize: 'medium',
            codeTheme: 'oneDark',
            showTimestamps: true,
            showWordCount: false,
            enableSounds: false,
            autoScroll: true,
            compactMode: false,
            showTokenCount: false,
            enableMarkdown: true,
            enableCodeHighlighting: true,
            maxHistoryLength: 100,
            exportFormat: 'json',
            language: 'en',
            responseFormat: 'default'
        };
        setLocalSettings(defaultSettings);
    };

    const updateSetting = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const predefinedPrompts = [
        {
            name: "Creative Assistant",
            prompt: "You are a creative writing assistant. Help users with storytelling, creative writing, brainstorming ideas, and artistic projects. Be imaginative, inspiring, and supportive."
        },
        {
            name: "Code Expert",
            prompt: "You are a senior software engineer and coding expert. Provide clear, well-documented code examples, explain best practices, help debug issues, and suggest optimizations. Always consider security and performance."
        },
        {
            name: "Academic Tutor",
            prompt: "You are a knowledgeable academic tutor. Explain complex concepts clearly, provide step-by-step solutions, encourage critical thinking, and adapt your teaching style to the student's level."
        },
        {
            name: "Business Analyst",
            prompt: "You are a business analyst and consultant. Provide strategic insights, analyze market trends, suggest business solutions, and help with decision-making processes. Be professional and data-driven."
        },
        {
            name: "Casual Friend",
            prompt: "You are a friendly, casual conversation partner. Be warm, empathetic, and engaging. Use a conversational tone and show genuine interest in the user's thoughts and experiences."
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader>
                    <HStack>
                        <Settings size={20} />
                        <Text>Advanced Settings</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Tabs variant="enclosed" colorScheme="blue">
                        <TabList>
                            <Tab><HStack><Brain size={16} /><Text>AI Model</Text></HStack></Tab>
                            <Tab><HStack><FileText size={16} /><Text>System Prompt</Text></HStack></Tab>
                            <Tab><HStack><Palette size={16} /><Text>Interface</Text></HStack></Tab>
                            <Tab><HStack><Code2 size={16} /><Text>Advanced</Text></HStack></Tab>
                            <Tab><HStack><Globe size={16} /><Text>Export/Import</Text></HStack></Tab>
                        </TabList>

                        <TabPanels>
                            {/* AI Model Settings */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <FormControl>
                                        <FormLabel>AI Model</FormLabel>
                                        <Select
                                            value={localSettings.model || 'gemini-2.0-flash'}
                                            onChange={(e) => updateSetting('model', e.target.value)}
                                        >
                                            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                        </Select>
                                        <FormHelperText>
                                            Gemini 2.0 Flash offers the best balance of speed and quality
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Temperature: {localSettings.temperature || 0.7}</FormLabel>
                                        <Slider
                                            value={localSettings.temperature || 0.7}
                                            onChange={(value) => updateSetting('temperature', value)}
                                            min={0}
                                            max={2}
                                            step={0.1}
                                            colorScheme="blue"
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb />
                                        </Slider>
                                        <HStack justify="space-between" fontSize="sm" color="gray.500">
                                            <Text>Focused</Text>
                                            <Text>Balanced</Text>
                                            <Text>Creative</Text>
                                        </HStack>
                                        <FormHelperText>
                                            Controls randomness in responses. Lower = more focused, Higher = more creative
                                        </FormHelperText>
                                    </FormControl>

                                    <HStack spacing={4}>
                                        <FormControl>
                                            <FormLabel>Max Tokens</FormLabel>
                                            <NumberInput
                                                value={localSettings.maxTokens || 8192}
                                                onChange={(_, value) => updateSetting('maxTokens', value)}
                                                min={1}
                                                max={32768}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormHelperText>Maximum response length</FormHelperText>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Top P</FormLabel>
                                            <NumberInput
                                                value={localSettings.topP || 0.8}
                                                onChange={(_, value) => updateSetting('topP', value)}
                                                min={0}
                                                max={1}
                                                step={0.1}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormHelperText>Nucleus sampling</FormHelperText>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Top K</FormLabel>
                                            <NumberInput
                                                value={localSettings.topK || 40}
                                                onChange={(_, value) => updateSetting('topK', value)}
                                                min={1}
                                                max={100}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormHelperText>Top-k sampling</FormHelperText>
                                        </FormControl>
                                    </HStack>

                                    <Alert status="info">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            These parameters control how the AI generates responses.
                                            Default values work well for most use cases.
                                        </Text>
                                    </Alert>
                                </VStack>
                            </TabPanel>

                            {/* System Prompt */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel mb="0">Enable System Prompt</FormLabel>
                                        <Switch
                                            isChecked={localSettings.enableSystemPrompt || false}
                                            onChange={(e) => updateSetting('enableSystemPrompt', e.target.checked)}
                                            colorScheme="blue"
                                        />
                                    </FormControl>

                                    {localSettings.enableSystemPrompt && (
                                        <>
                                            <Box>
                                                <Text fontWeight="semibold" mb={3}>Predefined Prompts</Text>
                                                <VStack spacing={2} align="stretch">
                                                    {predefinedPrompts.map((prompt, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            textAlign="left"
                                                            h="auto"
                                                            p={3}
                                                            onClick={() => updateSetting('systemPrompt', prompt.prompt)}
                                                        >
                                                            <VStack align="start" spacing={1}>
                                                                <Text fontWeight="semibold">{prompt.name}</Text>
                                                                <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                                                    {prompt.prompt}
                                                                </Text>
                                                            </VStack>
                                                        </Button>
                                                    ))}
                                                </VStack>
                                            </Box>

                                            <FormControl>
                                                <FormLabel>Custom System Prompt</FormLabel>
                                                <Textarea
                                                    value={localSettings.systemPrompt || ''}
                                                    onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                                                    placeholder="Enter a system prompt to define the AI's behavior and personality..."
                                                    rows={8}
                                                    resize="vertical"
                                                />
                                                <FormHelperText>
                                                    This prompt will be sent with every conversation to guide the AI's behavior.
                                                    Be specific about the role, tone, and style you want.
                                                </FormHelperText>
                                            </FormControl>
                                        </>
                                    )}
                                </VStack>
                            </TabPanel>

                            {/* Interface Settings */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <HStack spacing={8}>
                                        <FormControl display="flex" alignItems="center">
                                            <FormLabel mb="0">Dark Mode</FormLabel>
                                            <Switch
                                                isChecked={localSettings.darkMode || false}
                                                onChange={(e) => updateSetting('darkMode', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </FormControl>

                                        <FormControl display="flex" alignItems="center">
                                            <FormLabel mb="0">Compact Mode</FormLabel>
                                            <Switch
                                                isChecked={localSettings.compactMode || false}
                                                onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </FormControl>
                                    </HStack>

                                    <HStack spacing={4}>
                                        <FormControl>
                                            <FormLabel>Font Size</FormLabel>
                                            <Select
                                                value={localSettings.fontSize || 'medium'}
                                                onChange={(e) => updateSetting('fontSize', e.target.value)}
                                            >
                                                <option value="small">Small</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large</option>
                                                <option value="xl">Extra Large</option>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Code Theme</FormLabel>
                                            <Select
                                                value={localSettings.codeTheme || 'oneDark'}
                                                onChange={(e) => updateSetting('codeTheme', e.target.value)}
                                            >
                                                <option value="oneDark">One Dark</option>
                                                <option value="github">GitHub</option>
                                                <option value="dracula">Dracula</option>
                                                <option value="monokai">Monokai</option>
                                            </Select>
                                        </FormControl>
                                    </HStack>

                                    <VStack spacing={3} align="stretch">
                                        <Text fontWeight="semibold">Display Options</Text>

                                        <HStack justify="space-between">
                                            <Text>Show Timestamps</Text>
                                            <Switch
                                                isChecked={localSettings.showTimestamps !== false}
                                                onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Show Word Count</Text>
                                            <Switch
                                                isChecked={localSettings.showWordCount || false}
                                                onChange={(e) => updateSetting('showWordCount', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Show Token Count</Text>
                                            <Switch
                                                isChecked={localSettings.showTokenCount || false}
                                                onChange={(e) => updateSetting('showTokenCount', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Auto Scroll</Text>
                                            <Switch
                                                isChecked={localSettings.autoScroll !== false}
                                                onChange={(e) => updateSetting('autoScroll', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Enable Sounds</Text>
                                            <Switch
                                                isChecked={localSettings.enableSounds || false}
                                                onChange={(e) => updateSetting('enableSounds', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </TabPanel>

                            {/* Advanced Settings */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <VStack spacing={3} align="stretch">
                                        <Text fontWeight="semibold">Performance</Text>

                                        <HStack justify="space-between">
                                            <Text>Streaming Responses</Text>
                                            <Switch
                                                isChecked={localSettings.streamingEnabled !== false}
                                                onChange={(e) => updateSetting('streamingEnabled', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Auto Save Chats</Text>
                                            <Switch
                                                isChecked={localSettings.autoSave || true}
                                                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Enable Markdown</Text>
                                            <Switch
                                                isChecked={localSettings.enableMarkdown || true}
                                                onChange={(e) => updateSetting('enableMarkdown', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>

                                        <HStack justify="space-between">
                                            <Text>Code Highlighting</Text>
                                            <Switch
                                                isChecked={localSettings.enableCodeHighlighting || true}
                                                onChange={(e) => updateSetting('enableCodeHighlighting', e.target.checked)}
                                                colorScheme="blue"
                                            />
                                        </HStack>
                                    </VStack>

                                    <Divider />

                                    <FormControl>
                                        <FormLabel>Max History Length</FormLabel>
                                        <NumberInput
                                            value={localSettings.maxHistoryLength || 100}
                                            onChange={(_, value) => updateSetting('maxHistoryLength', value)}
                                            min={10}
                                            max={1000}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <FormHelperText>
                                            Maximum number of messages to keep in memory
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Response Format</FormLabel>
                                        <Select
                                            value={localSettings.responseFormat || 'default'}
                                            onChange={(e) => updateSetting('responseFormat', e.target.value)}
                                        >
                                            <option value="default">Default</option>
                                            <option value="detailed">Detailed</option>
                                            <option value="concise">Concise</option>
                                            <option value="structured">Structured</option>
                                        </Select>
                                        <FormHelperText>
                                            Preferred response style and format
                                        </FormHelperText>
                                    </FormControl>
                                </VStack>
                            </TabPanel>

                            {/* Export/Import */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Export Format</Text>
                                        <Select
                                            value={localSettings.exportFormat || 'json'}
                                            onChange={(e) => updateSetting('exportFormat', e.target.value)}
                                        >
                                            <option value="json">JSON</option>
                                            <option value="markdown">Markdown</option>
                                            <option value="txt">Plain Text</option>
                                            <option value="html">HTML</option>
                                        </Select>
                                    </Box>

                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Language</Text>
                                        <Select
                                            value={localSettings.language || 'en'}
                                            onChange={(e) => updateSetting('language', e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="it">Italian</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="ru">Russian</option>
                                            <option value="ja">Japanese</option>
                                            <option value="ko">Korean</option>
                                            <option value="zh">Chinese</option>
                                        </Select>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Settings Backup</Text>
                                        <HStack spacing={3}>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const settingsBlob = new Blob([JSON.stringify(localSettings, null, 2)], {
                                                        type: 'application/json'
                                                    });
                                                    const url = URL.createObjectURL(settingsBlob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = 'gemini-chat-settings.json';
                                                    a.click();
                                                    URL.revokeObjectURL(url);
                                                }}
                                            >
                                                Export Settings
                                            </Button>
                                            <Text fontSize="sm" color="gray.600">
                                                Save your current settings configuration
                                            </Text>
                                        </HStack>
                                    </Box>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3}>
                        <Button variant="ghost" onClick={handleReset}>
                            Reset to Defaults
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleSave}>
                            Save Settings
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

AdvancedSettings.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

export default AdvancedSettings; 