// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  PieChart,
  Wallet,
  Image,
  Share,
  Trash2,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { Card } from "../components/Card";
import Chat from "../components/Chat";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("nft");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [savedInsights, setSavedInsights] = useState(() => {
    // Initialize from localStorage during component mount
    const saved = localStorage.getItem("savedInsights");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedInsights", JSON.stringify(savedInsights));
  }, [savedInsights]);

const handleSaveInsight = (insight) => {
    console.log("Dashboard: Saving insight", insight);
    try {
        setSavedInsights((prevInsights) => {
            const newInsights = [...prevInsights, insight];
            localStorage.setItem("savedInsights", JSON.stringify(newInsights));
            return newInsights;
        });
        console.log("Successfully saved insight:", insight);
    } catch (error) {
        console.error("Error in handleSaveInsight:", error);
    }
};

  const handleDeleteInsight = (insightToDelete) => {
    const newInsights = savedInsights.filter(
      (insight) => insight !== insightToDelete
    );
    setSavedInsights(newInsights);
    localStorage.setItem("savedInsights", JSON.stringify(newInsights));
  };

  const tabs = [
    { id: "nft", label: "NFT Discovery", icon: <Image className="w-4 h-4" /> },
    {
      id: "dao",
      label: "DAO Treasury",
      icon: <PieChart className="w-4 h-4" />,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              AI-Powered Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#1E1E1E] text-white rounded-lg hover:bg-[#1E1E1E]">
                <Wallet className="w-4 h-4" />
                <span>0x077e....b8d53</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 px-1 ${
                    activeTab === tab.id
                      ? "border-[#1E1E1E] text-[#1E1E1E]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Static Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "nft" ? (
                <>
                  <Card title="Trending Collections">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Bored Ape YC</span>
                        <span className="text-green-500">+24.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>CryptoPunks</span>
                        <span className="text-red-500">-2.3%</span>
                      </div>
                    </div>
                  </Card>
                  <Card title="AI Recommendations">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Based on your preferences:
                      </p>
                      <ul className="list-disc pl-4">
                        <li>Upcoming artist collection launching next week</li>
                        <li>Undervalued blue-chip with strong community</li>
                      </ul>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card title="Treasury Overview">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Value:</span>
                        <span className="font-semibold">$1.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staked Assets:</span>
                        <span className="font-semibold">45%</span>
                      </div>
                    </div>
                  </Card>
                  <Card title="AI Insights">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Recent recommendations:
                      </p>
                      <ul className="list-disc pl-4">
                        <li>Increase staking allocation by 10%</li>
                        <li>Rebalance treasury to reduce volatility</li>
                      </ul>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Saved AI Insights */}
            {savedInsights
              .filter((insight) => {
                if (activeTab === "nft") return insight.category === "NFT";
                if (activeTab === "dao") return insight.category === "DAO";
                return true;
              })
              .map((insight, index) => (
                <Card key={index} title={insight.title} className="relative">
                  <div className="prose max-w-none text-sm text-gray-600">
                    {insight.content}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteInsight(insight)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Share className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-[#1E1E1E]rounded-full">
                      {insight.category}
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        </main>

        {/* Chat Sidebar */}
        <div
          className={`fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
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
              <Chat onSaveInsight={handleSaveInsight} activeTab={activeTab} />
            </div>
          </div>
        </div>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 p-4 bg-[#1E1E1E] text-white rounded-full shadow-lg hover:bg-[#1E1E1E]"
        >
          {isChatOpen ? "✕" : "💬"}
        </button>
      </div>
    </Layout>
  );
};

export default Dashboard;
