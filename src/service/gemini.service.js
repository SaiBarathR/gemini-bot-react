import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiService = {
    sendMessages: async function (message, history, apiKey, modelName) {
        if (!apiKey) {
            throw new Error("API Key is required");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
            history: history,
        });

        const makeRequest = async (retries = 3, delay = 1000) => {
            try {
                const result = await chat.sendMessageStream(message);
                return result.stream;
            } catch (error) {
                if ((error.status === 503 || error.message.includes('503')) && retries > 0) {
                    console.log(`Model overloaded, retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return makeRequest(retries - 1, delay * 2);
                }
                throw error;
            }
        };

        return makeRequest();
    }
};

export default GeminiService;
