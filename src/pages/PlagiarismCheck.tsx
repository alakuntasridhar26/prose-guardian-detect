
import React from 'react';
import { Header } from '@/components/Header';
import { AdvancedPlagiarismDetector } from '@/components/AdvancedPlagiarismDetector';

export default function PlagiarismCheck() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab="plagiarism" setActiveTab={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <AdvancedPlagiarismDetector />
      </main>
    </div>
  );
}
