
import { useState } from 'react';
import { CheckCircle, AlertCircle, Download, FileText } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface SpellSuggestion {
  word: string;
  suggestions: string[];
  position: number;
  confidence: number;
}

export const SpellChecker = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<SpellSuggestion[]>([]);
  const [correctedText, setCorrectedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Mock spell checking function
  const analyzeText = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock suggestions
    const mockSuggestions: SpellSuggestion[] = [
      { word: 'teh', suggestions: ['the', 'tea', 'tech'], position: 0, confidence: 0.95 },
      { word: 'recieve', suggestions: ['receive', 'achieve', 'deceive'], position: 20, confidence: 0.89 },
    ];
    
    setSuggestions(mockSuggestions);
    setCorrectedText(text.replace(/teh/g, 'the').replace(/recieve/g, 'receive'));
    setIsAnalyzing(false);
  };

  const applySuggestion = (suggestion: SpellSuggestion, newWord: string) => {
    const newText = text.replace(suggestion.word, newWord);
    setText(newText);
    setSuggestions(suggestions.filter(s => s !== suggestion));
  };

  const handleFileProcessed = (content: string, filename: string) => {
    setText(content);
    setUploadedFileName(filename);
    setSuggestions([]);
    setCorrectedText('');
  };

  const exportReport = () => {
    const report = `Spell Check Report
Generated: ${new Date().toLocaleString()}
${uploadedFileName ? `Source File: ${uploadedFileName}` : ''}

Original Text:
${text}

Corrected Text:
${correctedText}

Suggestions Applied: ${suggestions.length}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spell-check-report.txt';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Spell Checker</h2>
              <p className="text-gray-600">AI-powered contextual spell correction</p>
            </div>
          </div>
          {correctedText && (
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here or upload a file to check for spelling errors..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">{text.length} characters</span>
            <button
              onClick={analyzeText}
              disabled={!text.trim() || isAnalyzing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Check Spelling'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-900">
                      "{suggestion.word}" - Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.suggestions.map((word, i) => (
                      <button
                        key={i}
                        onClick={() => applySuggestion(suggestion, word)}
                        className="px-3 py-1 bg-white border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : correctedText ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Text analysis complete!</span>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Corrected Text:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{correctedText}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Upload a file or enter text and click "Check Spelling" to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
