import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader, Save } from 'lucide-react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api";
import AIWriter from "react-aiwriter";

const Chat = ({  onSaveInsight, activeTab = 'nft' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [error, setError] = useState('');
    const maxChars = 10000;
    
    const queryClient = useQueryClient();
    const [agentId, setAgentId] = useState("StarkWatch");

   
    const handleSaveInsight = (message) => {
        if (!onSaveInsight) {
            console.error("onSaveInsight prop is not provided");
            setError("Unable to save insight. Please try again later.");
            setTimeout(() => setError(''), 3000);
            return;
        }
    
        try {
            const newInsight = {
                id: Date.now().toString(),
                title: `AI Insight - ${new Date().toLocaleDateString()}`,
                content: message.text,
                timestamp: new Date().toISOString(),
                category: activeTab === 'dao' ? 'DAO' : 'NFT',
                type: 'insight'
            };
            
            onSaveInsight(newInsight);
            setError('Insight saved successfully!');
            setTimeout(() => setError(''), 3000);
        } catch (error) {
            console.error("Error saving insight:", error);
            setError("Failed to save insight. Please try again.");
            setTimeout(() => setError(''), 3000);
        }
    };

    const sendMessageMutation = useMutation({
        mutationKey: ["send_message", agentId],
        mutationFn: ({ message }) => apiClient.sendMessage(agentId, message),
        onSuccess: (newMessages) => {
            const formattedMessages = newMessages.map(msg => ({
                text: msg.text,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString(),
                canSave: true  // Ensure this is set to true for AI messages
            }));
            
            setMessages(prev => [...prev.filter(msg => !msg.isLoading), ...formattedMessages]);
        },
        onError: (error) => {
            setError(error.message);
            setMessages(prev => prev.filter(msg => !msg.isLoading));
        }
    });

    useEffect(() => {
        const checkConnection = async () => {
            try {
                await apiClient.sendMessage(agentId, "ping");
                setError('');
            } catch (error) {
                setError('Failed to connect to Eliza backend. Is the server running?');
            }
        };
        checkConnection();
    }, [agentId]);

    const handleSend = async () => {
        if (!agentId) {
            setError('No agent connected. Please wait for connection.');
            return;
        }
        if (input.trim()) {
            const userMessage = {
                text: input,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString(),
            };
            const loadingMessage = {
                text: "...",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString(),
                isLoading: true,
            };
            setMessages(prev => [...prev, userMessage, loadingMessage]);
            setInput('');
            setCharCount(0);
            sendMessageMutation.mutate({ message: input });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full">
            <div className="flex flex-col w-full bg-gray-50 border-r">
                <div className="px-4 py-3 bg-white border-b">
                    <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-[#1E1E1E]" />
                        <h3 className="font-medium">
                            {agentId || 'Connecting...'}
                        </h3>
                    </div>
                </div>

                {error && (
                    <div className={`p-4 ${error.includes('saved successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} text-sm`}>
                        {error}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-[#1E1E1E] text-white' : 'bg-white border border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        <span className="text-xs opacity-75">{msg.timestamp}</span>
                                    </div>
                                    {msg.sender === 'ai' && !msg.isLoading && (
                                        <button
                                            onClick={() => handleSaveInsight(msg)}
                                            className="p-2 hover:bg-blue-100 rounded flex items-center space-x-2 text-[#1E1E1E] transition-colors"
                                            title="Save this insight"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span className="text-xs font-medium">Save Insight</span>
                                        </button>
                                    )}
                                </div>
                                <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                                    {msg.isLoading ? (
                                        <span className="flex items-center space-x-2">
                                            <Loader className="w-4 h-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </span>
                                    ) : (
                                        msg.text
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t">
                    <div className="relative">
                        <textarea
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent resize-none"
                            rows={3}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setCharCount(e.target.value.length);
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder={agentId ? "Type your message here..." : "Please wait for connection..."}
                            maxLength={maxChars}
                            disabled={!agentId || sendMessageMutation.isLoading}
                        />
                        <button
                            className="absolute right-2 bottom-2 p-2 bg-[#1E1E1E] text-white rounded-lg hover:bg-[#1E1E1E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            onClick={handleSend}
                            disabled={!agentId || sendMessageMutation.isLoading || !input.trim()}
                        >
                            {sendMessageMutation.isLoading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>{charCount}/{maxChars} characters</span>
                        <span>Press Enter to send</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;