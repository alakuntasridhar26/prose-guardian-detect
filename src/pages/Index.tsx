
import { useState } from 'react';
import { Header } from '@/components/Header';
import { SpellChecker } from '@/components/SpellChecker';
import { PlagiarismDetector } from '@/components/PlagiarismDetector';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'spell' | 'plagiarism'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'spell' && <SpellChecker />}
        {activeTab === 'plagiarism' && <PlagiarismDetector />}
      </main>
    </div>
  );
};

export default Index;
