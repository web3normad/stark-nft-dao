import { useState } from 'react';
import { apiClient } from '../../../../../eliza_ai/client/src/lib/api';

export interface Insight {
  id: number;
  type: 'nft' | 'dao';
  title: string;
  description: string;
  prediction: string;
  timestamp: string;
  confidence: number;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);

  const addInsight = (insight: Omit<Insight, 'id'>) => {
    setInsights(prev => [
      ...prev,
      {
        ...insight,
        id: Date.now(),
      }
    ]);
  };

  const processElizaResponse = async (message: string) => {
    const response = await apiClient.sendMessage('your-agent-id', message); // Replace 'your-agent-id' with the actual agent ID
    const insight = parseInsights(response);
    
    if (insight) {
      addInsight(insight);
    }

    return response;
  };

  const parseInsights = (response: any) => {
    if (response.insights) {
      return {
        ...response.insights,
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  };

  return {
    insights,
    addInsight,
    processElizaResponse,
  };
}
