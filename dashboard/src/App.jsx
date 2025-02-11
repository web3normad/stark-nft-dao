// src/App.tsx

import React from 'react';

import Dashboard from './pages/DashboardPage';
import { useInsights } from './components/Dashboard/hooks/useInsights';

const App = () => {
  const { insights, processElizaResponse } = useInsights();

  const handleElizaMessage = async (message) => {
  
    return processElizaResponse(message);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        {/* <ElizaChat onMessage={handleElizaMessage} /> */}
      </div>
      <div className="w-2/3">
        <Dashboard insights={insights} />
      </div>
    </div>
  );
};

export default App;