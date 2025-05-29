
interface SourceMatch {
  url: string;
  title: string;
  snippet: string;
  similarity: number;
  matchType: 'direct' | 'paraphrased' | 'semantic';
  confidence: number;
}

interface PlagiarismAnalysis {
  overallSimilarity: number;
  originalityScore: number;
  matches: SourceMatch[];
  commonPhrases: string[];
  suspiciousSegments: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    similarity: number;
    sources: SourceMatch[];
  }>;
}

export class PlagiarismEngine {
  private apiKey: string;
  private searchEngines: string[] = [
    'https://api.bing.microsoft.com/v7.0/search',
    'https://serpapi.com/search',
    'https://www.googleapis.com/customsearch/v1'
  ];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  async analyzePlagiarism(text: string, options: {
    deepScan?: boolean;
    includeAcademic?: boolean;
    minSimilarity?: number;
  } = {}): Promise<PlagiarismAnalysis> {
    const {
      deepScan = true,
      includeAcademic = true,
      minSimilarity = 0.3
    } = options;

    // Split text into segments for analysis
    const segments = this.segmentText(text);
    
    // Perform multiple types of analysis
    const [
      directMatches,
      semanticMatches,
      academicMatches
    ] = await Promise.all([
      this.findDirectMatches(segments),
      deepScan ? this.findSemanticMatches(segments) : [],
      includeAcademic ? this.searchAcademicSources(segments) : []
    ]);

    // Combine and deduplicate results
    const allMatches = this.combineMatches([
      ...directMatches,
      ...semanticMatches,
      ...academicMatches
    ]);

    // Filter by minimum similarity
    const filteredMatches = allMatches.filter(match => 
      match.similarity >= minSimilarity
    );

    // Calculate overall similarity and originality
    const overallSimilarity = this.calculateOverallSimilarity(text, filteredMatches);
    const originalityScore = Math.max(0, 100 - overallSimilarity);

    // Identify common phrases that shouldn't count as plagiarism
    const commonPhrases = this.identifyCommonPhrases(text);

    // Create suspicious segments
    const suspiciousSegments = this.createSuspiciousSegments(text, filteredMatches);

    return {
      overallSimilarity,
      originalityScore,
      matches: filteredMatches,
      commonPhrases,
      suspiciousSegments
    };
  }

  private segmentText(text: string): string[] {
    // Split into sentences and larger chunks
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const chunks = [];
    
    // Create overlapping chunks of 3-5 sentences
    for (let i = 0; i < sentences.length; i++) {
      const chunk = sentences.slice(i, i + 3).join('. ').trim();
      if (chunk.length > 50) {
        chunks.push(chunk);
      }
    }
    
    return chunks;
  }

  private async findDirectMatches(segments: string[]): Promise<SourceMatch[]> {
    const matches: SourceMatch[] = [];
    
    for (const segment of segments) {
      try {
        // Simulate web search for exact phrases
        const searchResults = await this.performWebSearch(`"${segment}"`);
        
        for (const result of searchResults) {
          if (this.calculateTextSimilarity(segment, result.snippet) > 0.8) {
            matches.push({
              url: result.url,
              title: result.title,
              snippet: result.snippet,
              similarity: this.calculateTextSimilarity(segment, result.snippet),
              matchType: 'direct',
              confidence: 0.95
            });
          }
        }
      } catch (error) {
        console.warn('Direct search failed for segment:', error);
      }
    }
    
    return matches;
  }

  private async findSemanticMatches(segments: string[]): Promise<SourceMatch[]> {
    const matches: SourceMatch[] = [];
    
    for (const segment of segments) {
      try {
        // Search for semantic variations
        const paraphrases = this.generateParaphrases(segment);
        
        for (const paraphrase of paraphrases) {
          const searchResults = await this.performWebSearch(paraphrase);
          
          for (const result of searchResults) {
            const semanticSimilarity = await this.calculateSemanticSimilarity(segment, result.snippet);
            
            if (semanticSimilarity > 0.6) {
              matches.push({
                url: result.url,
                title: result.title,
                snippet: result.snippet,
                similarity: semanticSimilarity,
                matchType: 'semantic',
                confidence: semanticSimilarity * 0.8
              });
            }
          }
        }
      } catch (error) {
        console.warn('Semantic search failed for segment:', error);
      }
    }
    
    return matches;
  }

  private async searchAcademicSources(segments: string[]): Promise<SourceMatch[]> {
    const matches: SourceMatch[] = [];
    const academicSources = [
      'site:arxiv.org',
      'site:scholar.google.com',
      'site:pubmed.ncbi.nlm.nih.gov',
      'site:jstor.org',
      'site:researchgate.net'
    ];
    
    for (const segment of segments) {
      for (const source of academicSources) {
        try {
          const searchResults = await this.performWebSearch(`${segment} ${source}`);
          
          for (const result of searchResults) {
            const similarity = this.calculateTextSimilarity(segment, result.snippet);
            
            if (similarity > 0.5) {
              matches.push({
                url: result.url,
                title: result.title,
                snippet: result.snippet,
                similarity,
                matchType: 'paraphrased',
                confidence: similarity * 0.9
              });
            }
          }
        } catch (error) {
          console.warn('Academic search failed:', error);
        }
      }
    }
    
    return matches;
  }

  private async performWebSearch(query: string): Promise<Array<{url: string, title: string, snippet: string}>> {
    // Mock implementation - in production, this would use real search APIs
    const mockResults = [
      {
        url: 'https://example.com/paper1',
        title: 'Academic Research Paper on AI',
        snippet: query.includes('machine learning') ? 
          'Machine learning algorithms have revolutionized data processing and analysis in recent years.' :
          'This is a sample snippet that might contain similar content to the search query.'
      },
      {
        url: 'https://wikipedia.org/ai-article',
        title: 'Wikipedia - Artificial Intelligence',
        snippet: query.includes('neural') ?
          'Neural networks are computational models inspired by biological neural networks that constitute animal brains.' :
          'Artificial intelligence represents a significant advancement in computer science.'
      }
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockResults;
  }

  private generateParaphrases(text: string): string[] {
    // Generate semantic variations for better matching
    const words = text.toLowerCase().split(' ');
    const synonyms: Record<string, string[]> = {
      'machine': ['artificial', 'computer', 'automated'],
      'learning': ['education', 'training', 'acquisition'],
      'algorithm': ['method', 'procedure', 'technique'],
      'data': ['information', 'facts', 'statistics'],
      'process': ['procedure', 'method', 'technique'],
      'analyze': ['examine', 'study', 'investigate'],
      'significant': ['important', 'notable', 'considerable'],
      'recent': ['latest', 'current', 'modern']
    };
    
    const paraphrases: string[] = [];
    
    // Generate variations by replacing synonyms
    for (let i = 0; i < Math.min(3, words.length); i++) {
      const word = words[i];
      if (synonyms[word]) {
        synonyms[word].forEach(synonym => {
          const variation = [...words];
          variation[i] = synonym;
          paraphrases.push(variation.join(' '));
        });
      }
    }
    
    return paraphrases.slice(0, 5); // Limit to 5 variations
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\W+/));
    const words2 = new Set(text2.toLowerCase().split(/\W+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private async calculateSemanticSimilarity(text1: string, text2: string): Promise<number> {
    // Simplified semantic similarity calculation
    const commonWords = this.findCommonSemanticWords(text1, text2);
    const textSimilarity = this.calculateTextSimilarity(text1, text2);
    
    // Combine lexical and semantic similarities
    return (textSimilarity * 0.6) + (commonWords * 0.4);
  }

  private findCommonSemanticWords(text1: string, text2: string): number {
    const semanticGroups = [
      ['ai', 'artificial intelligence', 'machine learning', 'neural networks'],
      ['data', 'information', 'dataset', 'statistics'],
      ['algorithm', 'method', 'procedure', 'technique'],
      ['analysis', 'examination', 'study', 'research']
    ];
    
    let matches = 0;
    for (const group of semanticGroups) {
      const text1Lower = text1.toLowerCase();
      const text2Lower = text2.toLowerCase();
      
      const hasGroup1 = group.some(word => text1Lower.includes(word));
      const hasGroup2 = group.some(word => text2Lower.includes(word));
      
      if (hasGroup1 && hasGroup2) matches++;
    }
    
    return matches / semanticGroups.length;
  }

  private combineMatches(matches: SourceMatch[]): SourceMatch[] {
    const combined = new Map<string, SourceMatch>();
    
    for (const match of matches) {
      const key = `${match.url}-${match.snippet.substring(0, 50)}`;
      
      if (!combined.has(key) || combined.get(key)!.similarity < match.similarity) {
        combined.set(key, match);
      }
    }
    
    return Array.from(combined.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Limit to top 10 matches
  }

  private calculateOverallSimilarity(text: string, matches: SourceMatch[]): number {
    if (matches.length === 0) return 0;
    
    const weightedSimilarity = matches.reduce((sum, match) => {
      const weight = match.confidence * (match.matchType === 'direct' ? 1.0 : 0.8);
      return sum + (match.similarity * weight);
    }, 0);
    
    return Math.min(100, (weightedSimilarity / matches.length) * 100);
  }

  private identifyCommonPhrases(text: string): string[] {
    const commonPhrases = [
      'in conclusion',
      'on the other hand',
      'according to',
      'as a result',
      'in addition',
      'for example',
      'it is important to note',
      'studies have shown',
      'research indicates'
    ];
    
    return commonPhrases.filter(phrase => 
      text.toLowerCase().includes(phrase)
    );
  }

  private createSuspiciousSegments(text: string, matches: SourceMatch[]): Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    similarity: number;
    sources: SourceMatch[];
  }> {
    const segments = [];
    const sentences = text.split(/[.!?]+/);
    let currentIndex = 0;
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 10) {
        currentIndex += sentence.length + 1;
        continue;
      }
      
      const relatedMatches = matches.filter(match => 
        this.calculateTextSimilarity(trimmedSentence, match.snippet) > 0.4
      );
      
      if (relatedMatches.length > 0) {
        const avgSimilarity = relatedMatches.reduce((sum, match) => 
          sum + match.similarity, 0
        ) / relatedMatches.length;
        
        segments.push({
          text: trimmedSentence,
          startIndex: currentIndex,
          endIndex: currentIndex + trimmedSentence.length,
          similarity: avgSimilarity,
          sources: relatedMatches
        });
      }
      
      currentIndex += sentence.length + 1;
    }
    
    return segments.sort((a, b) => b.similarity - a.similarity);
  }
}
