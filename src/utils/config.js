export const config = {
    "API_KEY": import.meta.env.VITE_GEMINI_API_KEY || "",
    "MODEL_NAME": "gemini-2.0-flash",
    "MAX_TOKENS": 8192,
    "TEMPERATURE": 0.7,
    "TOP_P": 0.8,
    "TOP_K": 40
}