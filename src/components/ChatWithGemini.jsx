/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Input } from "@chakra-ui/react";
import { InputGroup, Box, InputRightElement, Button } from "@chakra-ui/react"
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react'
import { Textarea } from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import ReactMarkdown from 'react-markdown'
import GeminiService from "../service/gemini.service";
import useGemini from "../hooks/useGemini";
import PropTypes from 'prop-types'

const ChatWithGemini = () => {

    const { messages, loading, sendMessages, updateMessage } = useGemini()
    const [input, setInput] = useState('');

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView({
            behavior: 'smooth', block: 'start', inline: 'nearest',
        }));
        return <div ref={elementRef} />;
    };

    const handleSend = async () => {
        if (!input) return
        setInput('')
        updateMessage([...messages, { "role": "user", "parts": [{ "text": input }] }])
        sendMessages({ message: input, history: messages })
    }

    return (
        <>
            <Box className="w-[100%] self-center max-w-[1400px] m-4 overflow-auto rounded-md h-[80%] items-center">
                <Box className="overflow-auto px-10 py-4 flex flex-col">
                    {messages.length > 0 ? messages.map((message, index) => <RenderMessage loading={loading} key={index + message.role} messageLength={messages.length} message={message} msgIndex={index} />) :
                        <Introduction />
                    }
                    <AlwaysScrollToBottom />
                </Box>
            </Box>
            <Box className="flex max-w-[1400px] px-10 pt-2 w-[100%] self-center">
                <Box className="flex w-[100%] gap-2 justify-between items-center">
                    <Textarea
                        placeholder="Type a message"
                        value={input || ""}
                        sx={{
                            resize: 'none',
                            padding: '8px 14px 8px 14px',
                            background: 'gray.700',
                            color: 'white',
                            _placeholder: { color: 'white' },
                            h: '1.75rem',
                        }}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        variant={'unstyled'}
                    />
                    <Box className="flex gap-2 flex-col">
                        <Button colorScheme="whatsapp" h="1.75rem" size="sm" onClick={handleSend} rightIcon={<ArrowForwardIcon />}>
                            Send
                        </Button>
                        <Button color={"white"} _hover={{ bg: "blue.500", }} variant={'outline'} h="1.75rem" size="sm" onClick={() => updateMessage([])} rightIcon={<DeleteIcon />}>
                            Clear
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

const Introduction = () => {

    const TextRenderer = (props) => {
        // eslint-disable-next-line react/prop-types
        const { value = '', direction = 'r', size = 'large' } = props
        return <Text
            fontSize={size}
            bgGradient={`linear(to-${direction}, blue.100, cyan.700)`}
            bgClip={'text'}
            fontWeight={'bold'}
        >
            {value}
        </Text>
    }


    return <Box className="flex flex-col items-center justify-center">
        <Box className="flex flex-col items-center justify-center">
            <TextRenderer value="Welcome to Gemini AI" size="xxx-large" />
            <TextRenderer value="I'm Gemini, a chatbot that can help you with your queries" direction={'l'} />
        </Box>
        <Box className="flex flex-col items-center justify-center">
            <TextRenderer value="Type a message to get started" />
        </Box>
    </Box>
}

const RenderMessage = ({ message, msgIndex, loading, messageLength }) => {

    const { parts, role } = message

    const Loader = () => msgIndex === messageLength - 1 && loading && <Box className="flex self-start pt-2 ">
        <Box bgColor={'blue.500'} className="dot" />
        <Box bgColor={'blue.500'} className="dot" />
        <Box bgColor={'blue.500'} className="dot" />
    </Box>

    return (
        parts.map((part, index) => part.text ?
            <>
                <Box
                    as={motion.div}
                    className={`flex overflow-auto max-w-[95%]  md:max-w-[96%] w-fit items-end my-2 p-1 px-2 rounded-md ${role === 'user' ? 'self-end' : 'self-start'}`}
                    bgColor={role === 'user' ? 'blue.500' : 'gray.200'}
                    textColor={role === 'user' ? 'white' : 'black'}
                    initial={{ opacity: 0, scale: 0.5, y: 20, x: role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    key={index}
                >
                    <ReactMarkdown
                        className="text-sm"
                        key={index + part.text}
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
            </> : <Loader key={index + part.text} />
        ))

}

export default ChatWithGemini;