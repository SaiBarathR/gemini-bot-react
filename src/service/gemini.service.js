import { GoogleGenerativeAI, } from "@google/generative-ai";
import config from "../utils/config.json"

const GeminiService = (function () {

    const MODEL_NAME = "gemini-pro";
    const API_KEY = config.API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const service = {};

    service.sendMessages = async function (message, prevChat) {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = model.startChat({
            history: prevChat,
        });
        await chat.sendMessage(message);
        const history = await chat.getHistory();
        console.log("updated history:", history)
        return history
    }

    return service;
}());

export default GeminiService;
