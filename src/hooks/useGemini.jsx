import { useEffect, useState } from "react";
import GeminiService from "../service/gemini.service";

export default function useGemini() {

    const [messages, updateMessage] = useState(checkForMessages());
    const [loading, setLoading] = useState(false);

    function checkForMessages() {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : []
    }

    useEffect(() => {
        const saveMessages = () => localStorage.setItem('messages', JSON.stringify(messages));
        window.addEventListener('beforeunload', saveMessages);
        return () => window.removeEventListener('beforeunload', saveMessages);
    }, [messages]);

    const sendMessages = async (payload) => {
        setLoading(true)
        try {
            console.log("message", payload)
            const response = GeminiService.sendMessages(payload.message, payload.history);
            console.log('response', response)
            const message = await response;
            updateMessage(message)
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false)
        }
    }

    return { messages, loading, sendMessages, updateMessage }

}
