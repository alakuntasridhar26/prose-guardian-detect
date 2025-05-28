
import { FileText, Shield, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: 'dashboard' | 'spell' | 'plagiarism') => void;
}

export const Dashboard = ({ setActiveTab }: DashboardProps) => {
  const stats = [
    { label: 'Texts Analyzed', value: '2,847', icon: FileText, color: 'text-blue-600' },
    { label: 'Errors Corrected', value: '1,293', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Plagiarism Scans', value: '456', icon: Shield, color: 'text-purple-600' },
    { label: 'Issues Detected', value: '78', icon: AlertTriangle, color: 'text-orange-600' },
  ];

  const features = [
    {
      title: 'Spell Checker',
      description: 'Advanced contextual spell checking using transformer-based AI models.',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      action: () => setActiveTab('spell'),
    },
    {
      title: 'Plagiarism Detector',
      description: 'Comprehensive plagiarism detection with semantic similarity analysis.',
      icon: Shield,
      gradient: 'from-purple-500 to-purple-600',
      action: () => setActiveTab('plagiarism'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TextGuard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Advanced AI-powered platform for spell checking and plagiarism detection. 
          Ensure your content is accurate, original, and professionally written.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} text-white mr-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <button
                onClick={feature.action}
                className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${feature.gradient} text-white font-medium hover:opacity-90 transition-opacity duration-200`}
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Spell check completed', file: 'document.txt', time: '2 minutes ago', status: 'success' },
            { action: 'Plagiarism scan finished', file: 'essay.pdf', time: '15 minutes ago', status: 'warning' },
            { action: 'Text analysis uploaded', file: 'report.docx', time: '1 hour ago', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.file}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
