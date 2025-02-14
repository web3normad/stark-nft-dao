import { useState, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";

// Updated API client for Direct client integration
const apiClient = {
  sendMessage: async (agentId, message) => {
    const response = await fetch(`http://localhost:3000/${agentId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState('');
  const maxChars = 10000;
  
  // Use your Starknet agent ID
  const [agentId, setAgentId] = useState("StarknetAgent");

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }) => {
      try {
        const response = await apiClient.sendMessage(agentId, message);
        return response;
      } catch (error) {
        throw new Error('Failed to send message to agent');
      }
    },
    onSuccess: (response) => {
      // Handle the direct client response format
      const aiMessage = {
        text: response.response || response.message,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev.filter(msg => !msg.isLoading), aiMessage]);
    },
    onError: (error) => {
      setError(error.message);
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    }
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple health check to the Direct client
        const response = await fetch(`http://localhost:3000/health`);
        if (!response.ok) {
          throw new Error('Server not responding');
        }
        setError('');
      } catch (error) {
        setError('Failed to connect to Eliza backend. Is the server running?');
      }
    };
    checkConnection();
  }, []);

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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">
            {agentId || 'Connecting...'}
          </h3>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center space-x-2 mb-1">
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                <span className="text-xs opacity-75">{msg.timestamp}</span>
              </div>
              <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {msg.isLoading ? (
                  <span className="animate-pulse">...</span>
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
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCharCount(e.target.value.length);
            }}
            onKeyPress={handleKeyPress}
            placeholder={agentId ? "Type your message here..." : "Please wait for connection..."}
            maxLength={maxChars}
            disabled={!agentId}
          />
          <button
            className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            onClick={handleSend}
            disabled={!agentId || sendMessageMutation.isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>{charCount}/{maxChars} characters</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;