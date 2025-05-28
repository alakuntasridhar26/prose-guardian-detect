
import React from 'react';
import { Header } from '@/components/Header';
import { PlagiarismDetector } from '@/components/PlagiarismDetector';

export default function PlagiarismCheck() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab="plagiarism" setActiveTab={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <PlagiarismDetector />
      </main>
    </div>
  );
}
