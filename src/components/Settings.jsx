
import { useSettings } from '../context/SettingsContext';
import { Key, Cpu, Info } from 'lucide-react';

const Settings = () => {
    const {
        modelConfigs,
        setModelConfigs,
        availableModels
    } = useSettings();

    const handleApiKeyChange = (modelId, value) => {
        setModelConfigs(prev => ({
            ...prev,
            [modelId]: value
        }));

        // If it's the first key being added, maybe set it as default? 
        // For now, we just update the config map.
    };

    return (
        <div className="flex-1 h-full overflow-auto bg-gray-50 dark:bg-gray-950 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Configure your Gemini API keys and model preferences.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* API Key Section */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Model Configuration</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Configure API keys for each model you want to use.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {availableModels.map(model => (
                                <div key={model.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Cpu size={16} className="text-purple-500" />
                                            {model.name}
                                        </label>
                                        <span className="text-xs text-gray-400 font-mono">{model.id}</span>
                                    </div>
                                    <input
                                        type="password"
                                        value={modelConfigs[model.id] || ''}
                                        onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                                        placeholder={`API Key for ${model.name}`}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            ))}

                            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>
                                    You can use the same API key for all models if your key supports them.
                                    Get your keys from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-800 dark:hover:text-blue-200">Google AI Studio</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
