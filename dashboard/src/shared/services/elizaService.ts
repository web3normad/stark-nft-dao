export interface ElizaResponse {
    message: string;
    insights?: {
      type: 'nft' | 'dao';
      title: string;
      description: string;
      prediction: string;
      confidence: number;
    };
  }
  
  export const elizaService = {
    // Method to send messages to Eliza
    async sendMessage(message: string): Promise<ElizaResponse> {
      // Replace this with your actual Eliza integration
      const response = await fetch('/api/eliza', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      return response.json();
    },
  
    // Method to extract insights from Eliza's response
    parseInsights(response: ElizaResponse) {
      if (response.insights) {
        return {
          ...response.insights,
          timestamp: new Date().toISOString(),
        };
      }
      return null;
    }
  };