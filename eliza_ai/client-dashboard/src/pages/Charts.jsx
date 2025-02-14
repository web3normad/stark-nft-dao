// src/pages/Charts.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer 
} from 'recharts';
import { Card } from '../components/Card';

const dummyData = [
  { name: 'Jan', nftValue: 4000, daoValue: 2400, treasuryValue: 2400 },
  { name: 'Feb', nftValue: 3000, daoValue: 1398, treasuryValue: 2210 },
  { name: 'Mar', nftValue: 2000, daoValue: 9800, treasuryValue: 2290 },
  { name: 'Apr', nftValue: 2780, daoValue: 3908, treasuryValue: 2000 },
  { name: 'May', nftValue: 1890, daoValue: 4800, treasuryValue: 2181 },
  { name: 'Jun', nftValue: 2390, daoValue: 3800, treasuryValue: 2500 },
];

const Charts = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NFT Performance Chart */}
        <Card title="NFT Market Performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="nftValue" 
                  stroke="#8884d8" 
                  name="NFT Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* DAO Treasury Chart */}
        <Card title="DAO Treasury Overview">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="treasuryValue" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Treasury Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Asset Distribution */}
        <Card title="Asset Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="daoValue" fill="#8884d8" name="DAO Assets" />
                <Bar dataKey="nftValue" fill="#82ca9d" name="NFT Assets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card title="Performance Metrics">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total NFT Value</h4>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              <span className="text-green-500 text-sm">↑ 12.5%</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Treasury Balance</h4>
              <p className="text-2xl font-bold text-gray-900">$1.8M</p>
              <span className="text-red-500 text-sm">↓ 3.2%</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Active DAOs</h4>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <span className="text-green-500 text-sm">↑ 2</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">NFT Collections</h4>
              <p className="text-2xl font-bold text-gray-900">85</p>
              <span className="text-green-500 text-sm">↑ 5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Charts;