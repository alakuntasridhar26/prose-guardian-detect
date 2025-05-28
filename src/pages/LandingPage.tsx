
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, CheckCircle, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center py-20 px-6">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">TextGuard</h1>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Advanced AI-powered platform for spell checking and plagiarism detection. 
          Ensure your content is accurate, original, and professionally written.
        </p>
        
        <div className="space-x-4 mb-16">
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 inline-block"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="border border-blue-600 px-8 py-3 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200 inline-block"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Feature 
            title="Advanced Spell Correction" 
            icon={FileText} 
            description="Utilizes transformer-based AI models for context-aware corrections and improved writing quality." 
          />
          <Feature 
            title="Plagiarism Detection" 
            icon={Shield} 
            description="Detects copied content using semantic similarity analysis and highlights matched sources." 
          />
          <Feature 
            title="Secure Processing" 
            icon={CheckCircle} 
            description="Upload and analyze documents with secure processing and privacy protection." 
          />
          <Feature 
            title="Detailed Reports" 
            icon={BarChart3} 
            description="Get comprehensive analysis reports with similarity scores, corrections, and insights." 
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

function Feature({ title, icon: Icon, description }: FeatureProps) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl text-left border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-xl text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
