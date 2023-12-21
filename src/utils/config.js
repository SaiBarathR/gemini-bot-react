const env = import.meta.env.MODE
console.log('env', env)
localStorage.setItem('API_KEY', import.meta.env.VITE_APP_BOT_API_KEY)
export const config = {
    "API_KEY": env === "development" ? "" : import.meta.env.VITE_APP_BOT_API_KEY,
}