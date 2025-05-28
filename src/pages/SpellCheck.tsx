
import React from 'react';
import { Header } from '@/components/Header';
import { SpellChecker } from '@/components/SpellChecker';

export default function SpellCheck() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab="spell" setActiveTab={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <SpellChecker />
      </main>
    </div>
  );
}
