import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Wallet, Gift, TrendingUp, Save } from 'lucide-react';
import { ElizaChat } from '../../../eliza_ai/client/src/components/chat';
import { useInsights } from '../components/Dashboard/hooks/useInsights';

const Dashboard = () => {
  const { insights, addInsight } = useInsights();

  // Sample data for charts
  const performanceData = [
    { name: 'Jan', nft: 4000, dao: 2400 },
    { name: 'Feb', nft: 3000, dao: 1398 },
    { name: 'Mar', nft: 2000, dao: 9800 },
    { name: 'Apr', nft: 2780, dao: 3908 },
    { name: 'May', nft: 1890, dao: 4800 },
    { name: 'Jun', nft: 2390, dao: 3800 }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Insights Dashboard</h1>
        <p className="text-gray-600">StarkNet NFT & DAO Treasury Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nft">NFT Insights</TabsTrigger>
          <TabsTrigger value="dao">DAO Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="nft" stroke="#8884d8" />
                    <Line type="monotone" dataKey="dao" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Wallet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Connected Wallet:</span>
                    <span className="font-mono">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Network:</span>
                    <span>StarkNet Mainnet</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {insight.type === 'nft' ? <Gift className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      {insight.title}
                    </CardTitle>
                    <span className="text-sm text-gray-500">
                      Confidence: {insight.confidence}%
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{insight.description}</p>
                  <p className="text-sm text-gray-600">{insight.prediction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nft">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>NFT Discovery</CardTitle>
                <CardDescription>AI-powered NFT recommendations and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ElizaChat agentId="your-agent-id" /> {/* Replace 'your-agent-id' with the actual agent ID */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dao">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>DAO Treasury Management</CardTitle>
                <CardDescription>Treasury optimization and predictive analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <ElizaChat agentId="your-agent-id" /> {/* Replace 'your-agent-id' with the actual agent ID */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;