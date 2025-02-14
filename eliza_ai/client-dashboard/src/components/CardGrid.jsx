// Simple Card component
const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export const CardGrid = ({ activeTab }) => {
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

  const cards = activeTab === 'nft' ? nftCards : daoCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} title={card.title}>
          {card.content}
        </Card>
      ))}
    </div>
  );
};