// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Sidebar } from '../components/Layout';  
import { CardGrid } from '../components/CardGrid';
import { TabPanel } from '../components/TabPanel';
import Chat from '../components/Chat';  // Update the path to where your Chat component is located
import { Bell, Settings, PieChart, Wallet, Image } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('nft');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const tabs = [
    { id: 'nft', label: 'NFT Discovery', icon: <Image className="w-4 h-4" /> },
    { id: 'dao', label: 'DAO Treasury', icon: <PieChart className="w-4 h-4" /> }
  ];

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">AI-Powered Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
          
          <TabPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <CardGrid activeTab={activeTab} />
        </main>
      </div>

      {/* Chat Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
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
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        {isChatOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default Dashboard;