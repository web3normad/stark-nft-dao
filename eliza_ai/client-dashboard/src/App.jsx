// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Charts from './pages/Charts';
import Chat from './components/Chat';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient({
  defaultOptions: {
      queries: {
          staleTime: Number.POSITIVE_INFINITY,
      },
  },
});

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/charts" element={<Charts />} />
          </Routes>
        </div>

        {/* Chat Sidebar - Always present but toggled with isChatOpen */}
        <div 
          className={`fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
            isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        </div>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 z-50"
        >
          {isChatOpen ? '✕' : '💬'}
        </button>
      </div>
    </Router>
    </QueryClientProvider>
  );
};

export default App;