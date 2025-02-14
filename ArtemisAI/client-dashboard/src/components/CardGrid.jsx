import React from 'react';
import { Card } from './Card';
import { Share, Trash2, Bot } from 'lucide-react';

const CardGrid = ({ activeTab, savedInsights = [], onDeleteInsight }) => {
  // Rest of your component code stays exactly the same
  const nftCards = [
    {
      title: 'Trending Collections',
      content: (
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
      )
    },
    {
      title: 'AI Recommendations',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Based on your preferences:</p>
          <ul className="list-disc pl-4">
            <li>Upcoming artist collection launching next week</li>
            <li>Undervalued blue-chip with strong community</li>
          </ul>
        </div>
      )
    }
  ];

  const daoCards = [
    {
      title: 'Treasury Overview',
      content: (
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
      )
    },
    {
      title: 'AI Insights',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Recent recommendations:</p>
          <ul className="list-disc pl-4">
            <li>Increase staking allocation by 10%</li>
            <li>Rebalance treasury to reduce volatility</li>
          </ul>
        </div>
      )
    }
  ];

  const filteredInsights = savedInsights.filter(insight => {
    if (activeTab === 'nft') return insight.category.toLowerCase().includes('nft');
    if (activeTab === 'dao') return insight.category.toLowerCase().includes('dao');
    return true;
  });

  const staticCards = activeTab === 'nft' ? nftCards : daoCards;
  const InsightCard = ({ insight, onDelete }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-gray-900">{insight.title}</h3>
          </div>
          <button
            onClick={() => onDelete(insight.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2">
          <p className="text-gray-600 text-sm">{insight.content}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{new Date(insight.timestamp).toLocaleString()}</span>
          <span className="text-xs font-medium text-blue-500">{insight.category}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticCards.map((card, index) => (
          <Card key={`static-${index}`} title={card.title}>
            {card.content}
          </Card>
        ))}
      </div>

      {filteredInsights.length > 0 && (
        <>
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6">Saved AI Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsights.map((insight, index) => (
                <InsightCard
                  key={`insight-${index}`}
                  insight={insight}
                  onDelete={onDeleteInsight}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardGrid;