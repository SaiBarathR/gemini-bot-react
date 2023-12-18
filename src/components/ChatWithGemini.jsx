/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Input } from "@chakra-ui/react";
import { InputGroup, Box, InputRightElement, Button } from "@chakra-ui/react"
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import GeminiService from "../service/gemini.service";

const ChatWithGemini = () => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('');

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        }));
        return <div ref={elementRef} />;
    };

    const sendMessages = async (payload) => {
        setLoading(true)
        try {
            console.log("message", payload)
            const response = GeminiService.sendMessages(payload.message, payload.history);
            console.log('response', response)
            const message = await response;
            setMessages(message)
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async () => {
        if (!input) return
        setMessages([...messages, { "role": "user", "parts": [{ "text": input }] }])
        setInput('')
        sendMessages({ message: input, history: messages })
    }

    return (
        <>
            <Box className="w-[100%] self-center max-w-[1400px] m-4 overflow-auto rounded-md h-[80%] items-center">
                <Box className="overflow-auto px-10 py-4 flex flex-col">
                    {messages.map((message, index) => <RenderMessage loading={loading} key={index} messageLength={messages.length} message={message} msgIndex={index} />)}
                    <AlwaysScrollToBottom />
                </Box>
            </Box>
            <Box className="flex max-w-[1400px]  px-10 pt-2 w-[100%] self-center">
                <InputGroup size="md">
                    <Input color={'white'} placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                    <InputRightElement width="9rem" gap={2}>
                        <Button h="1.75rem" size="sm" onClick={handleSend}>
                            Send
                        </Button>
                        <Button h="1.75rem" size="sm" onClick={() => setMessages([])}>
                            Clear
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Box>
        </>
    );
};

const RenderMessage = ({ message, msgIndex, loading, messageLength }) => {

    const { parts, role } = message

    const Loader = () => msgIndex === messageLength - 1 && loading && <Box className="flex self-start pt-2 ">
        <Box bgColor={'blue.500'} className="dot" />
        <Box bgColor={'blue.500'} className="dot" />
        <Box bgColor={'blue.500'} className="dot" />
    </Box>

    return (
        parts.map((part, index) =>
            <>
                <Box
                    as={motion.div}
                    className={`flex overflow-auto max-w-[80%] w-fit items-end my-2 p-1 px-2 rounded-md ${role === 'user' ? 'self-end' : 'self-start'}`}
                    bgColor={role === 'user' ? 'blue.500' : 'gray.200'}
                    textColor={role === 'user' ? 'white' : 'black'}
                    initial={{ opacity: 0, scale: 0.5, y: 20, x: role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    key={index}
                >
                    <ReactMarkdown
                        className="text-sm"
                        key={index}
                        components={{
                            p: ({ node, ...props }) => <Text {...props} className="text-sm" />,
                            code: ({ node, ...props }) => <pre
                                {...props}
                                className="text-sm font-mono text-white bg-slate-800 rounded-md p-2 overflow-auto m-2 "
                            />
                        }}
                    >
                        {part.text}
                    </ReactMarkdown>
                </Box>
                <Loader />
            </>
        ))

}

export default ChatWithGemini;