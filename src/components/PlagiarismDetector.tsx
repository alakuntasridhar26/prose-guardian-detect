
import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface PlagiarismResult {
  similarity: number;
  source: string;
  matchedText: string;
  url?: string;
}

export const PlagiarismDetector = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PlagiarismResult[]>([]);
  const [overallSimilarity, setOverallSimilarity] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Mock plagiarism detection function
  const analyzeText = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults: PlagiarismResult[] = [
      {
        similarity: 85,
        source: 'Academic Paper - Journal of Computer Science',
        matchedText: 'Machine learning algorithms have revolutionized the way we process data',
        url: 'https://example.com/paper1'
      },
      {
        similarity: 72,
        source: 'Wikipedia - Artificial Intelligence',
        matchedText: 'Neural networks are computational models inspired by biological neural networks',
        url: 'https://wikipedia.org/ai'
      },
      {
        similarity: 45,
        source: 'Tech Blog - AI Insights',
        matchedText: 'Deep learning has shown remarkable progress in recent years',
        url: 'https://example.com/blog'
      }
    ];
    
    setResults(mockResults);
    setOverallSimilarity(67);
    setIsAnalyzing(false);
  };

  const handleFileProcessed = (content: string, filename: string) => {
    setText(content);
    setUploadedFileName(filename);
    setResults([]);
    setOverallSimilarity(0);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (similarity >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const exportReport = () => {
    const report = `Plagiarism Detection Report
Generated: ${new Date().toLocaleString()}
${uploadedFileName ? `Source File: ${uploadedFileName}` : ''}

Overall Similarity: ${overallSimilarity}%

Original Text:
${text}

Detected Matches:
${results.map((result, index) => `
${index + 1}. Similarity: ${result.similarity}%
   Source: ${result.source}
   Matched Text: "${result.matchedText}"
   URL: ${result.url || 'N/A'}
`).join('\n')}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plagiarism-report.txt';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Plagiarism Detector</h2>
              <p className="text-gray-600">Advanced semantic similarity analysis</p>
            </div>
          </div>
          {results.length > 0 && (
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h3>
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          acceptedTypes={['.pdf', '.docx', '.txt']}
          maxSizeInMB={10}
        />
        {uploadedFileName && (
          <div className="mt-3 text-sm text-green-600">
            ✓ File loaded: {uploadedFileName}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here or upload a file to check for plagiarism..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">{text.length} characters</span>
          <button
            onClick={analyzeText}
            disabled={!text.trim() || isAnalyzing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Check Plagiarism'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {isAnalyzing ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing text for plagiarism...</p>
            </div>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Similarity Score</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      overallSimilarity >= 80 ? 'bg-red-500' :
                      overallSimilarity >= 50 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${overallSimilarity}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-2xl font-bold ${
                overallSimilarity >= 80 ? 'text-red-600' :
                overallSimilarity >= 50 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {overallSimilarity}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {overallSimilarity >= 80 ? 'High similarity detected - Review required' :
               overallSimilarity >= 50 ? 'Moderate similarity detected' : 'Low similarity - Likely original'}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Matches</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getSimilarityColor(result.similarity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{result.similarity}% Similarity</span>
                    </div>
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Source</span>
                      </a>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 mb-1">{result.source}</p>
                  <p className="text-gray-700 italic">"{result.matchedText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Upload a file or enter text and click "Check Plagiarism" to see results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
