// src/components/Layout.jsx
import React from 'react';

export const Sidebar = () => (
  <aside className="w-64 bg-[#1E1E1E] rounded-r-xl text-white p-6">
    <div className="text-xl font-bold mb-8">ArtemisAI</div>
    <nav className="space-y-2">
      <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
      <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">NFT Portfolio</a>
      <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">DAO Management</a>
      <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Settings</a>
    </nav>
  </aside>
);

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};