import { useSettings } from '../context/SettingsContext';
import { Key, Cpu, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    };

    return (
        <div className="flex-1 h-full overflow-auto bg-primary p-8 transition-colors duration-300">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
                        <p className="text-text-secondary text-sm">
                            Configure your API keys and preferences.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* API Key Section */}
                    <div className="bg-secondary p-6 rounded-2xl border border-border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-zinc-800/50 rounded-lg">
                                <Key className="w-5 h-5 text-text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">Model Configuration</h3>
                                <p className="text-sm text-text-secondary">
                                    Enter API keys for each model you wish to use.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {availableModels.map(model => (
                                <div key={model.id} className="p-4 bg-primary/50 rounded-xl border border-border-color hover:border-zinc-500 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                                            <Cpu size={14} className="text-text-secondary" />
                                            {model.name}
                                        </label>
                                        <span className="text-[10px] text-text-secondary font-mono bg-secondary px-1.5 py-0.5 rounded">
                                            {model.id}
                                        </span>
                                    </div>
                                    <input
                                        type="password"
                                        value={modelConfigs[model.id] || ''}
                                        onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                                        placeholder={`API Key for ${model.name}`}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border-color bg-secondary text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            ))}

                            <div className="flex items-start gap-3 p-4 bg-primary/30 rounded-xl text-sm text-text-secondary border border-border-color">
                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-text-secondary" />
                                <p>
                                    Get your API keys from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
                                    Keys are stored locally in your browser.
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
