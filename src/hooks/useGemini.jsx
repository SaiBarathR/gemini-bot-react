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
        updateMessage((prevMessages) => [...prevMessages, { "role": "model", "parts": [{ "text": "" }] }])
        setLoading(true)
        try {
            console.log("message", payload)
            const stream = await GeminiService.sendMessages(payload.message, payload.history);
            setLoading(false)
            for await (const chunk of stream) {
                const chuckText = chunk.text();
                updateMessage((prevMessages) => {
                    const prevMessageClone = structuredClone(prevMessages);
                    prevMessageClone[prevMessages.length - 1].parts[0].text += chuckText;
                    return prevMessageClone;
                })
            }
        } catch (error) {
            updateMessage([...messages, { "role": "model", "parts": [{ "text": "Seems like I'm having trouble connecting to the server. Please try again later." }] }])
            console.error('An error occurred:', error);
        } finally {
            setLoading(false)
        }
    }

    return { messages, loading, sendMessages, updateMessage }

}
