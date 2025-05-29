
import { useToast } from '@/hooks/use-toast';

// SCOWL-based word lists (simplified for demo - in production, you'd load these from files)
const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
]);

const TECHNICAL_WORDS = new Set([
  'algorithm', 'authentication', 'database', 'implementation', 'programming', 'javascript', 'typescript', 'react', 'component',
  'function', 'variable', 'parameter', 'asynchronous', 'synchronous', 'api', 'endpoint', 'middleware', 'framework', 'library',
  'repository', 'deployment', 'environment', 'configuration', 'optimization', 'debugging', 'refactoring', 'inheritance',
  'polymorphism', 'encapsulation', 'abstraction', 'recursion', 'iteration', 'validation', 'serialization', 'deserialization'
]);

const RARE_VALID_WORDS = new Set([
  'serendipity', 'ephemeral', 'ubiquitous', 'mellifluous', 'perspicacious', 'sesquipedalian', 'defenestration', 'petrichor',
  'saudade', 'hygge', 'schadenfreude', 'zeitgeist', 'wanderlust', 'fernweh', 'hiraeth', 'ubuntu', 'ikigai', 'lagom'
]);

// Combine all dictionaries
const DICTIONARY = new Set([...COMMON_WORDS, ...TECHNICAL_WORDS, ...RARE_VALID_WORDS]);

export interface SpellingSuggestion {
  word: string;
  suggestions: string[];
  position: number;
  context: string;
  confidence: number;
  type: 'misspelling' | 'grammar' | 'slang' | 'context';
  preserveRare?: boolean;
}

export interface SpellCheckResult {
  suggestions: SpellingSuggestion[];
  correctedText: string;
  confidence: number;
  preservedRareWords: string[];
}

class AdvancedSpellChecker {
  private dictionary: Set<string>;
  private contextPatterns: Map<string, string[]>;

  constructor() {
    this.dictionary = DICTIONARY;
    this.initializeContextPatterns();
  }

  private initializeContextPatterns() {
    this.contextPatterns = new Map([
      // Common context-based corrections
      ['teh', ['the']],
      ['recieve', ['receive']],
      ['occured', ['occurred']],
      ['seperate', ['separate']],
      ['definately', ['definitely']],
      ['neccessary', ['necessary']],
      ['accomodate', ['accommodate']],
      ['embarass', ['embarrass']],
      ['begining', ['beginning']],
      ['writting', ['writing']],
      ['commited', ['committed']],
      ['existance', ['existence']],
      ['maintainance', ['maintenance']],
      ['independant', ['independent']],
      ['concious', ['conscious']],
      
      // Context-aware suggestions
      ['there', ['their', 'they\'re']],
      ['your', ['you\'re']],
      ['its', ['it\'s']],
      ['affect', ['effect']],
      ['accept', ['except']],
      ['loose', ['lose']],
      ['brake', ['break']],
      ['weather', ['whether']],
      ['piece', ['peace']],
      ['principle', ['principal']]
    ]);
  }

  private calculateEditDistance(word1: string, word2: string): number {
    const dp = Array(word1.length + 1).fill(null).map(() => Array(word2.length + 1).fill(0));
    
    for (let i = 0; i <= word1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= word2.length; j++) dp[0][j] = j;
    
    for (let i = 1; i <= word1.length; i++) {
      for (let j = 1; j <= word2.length; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      }
    }
    
    return dp[word1.length][word2.length];
  }

  private isValidWord(word: string): boolean {
    const normalized = word.toLowerCase().replace(/[^\w]/g, '');
    return this.dictionary.has(normalized);
  }

  private generateSuggestions(word: string, maxSuggestions: number = 5): string[] {
    const suggestions: Array<{ word: string; distance: number }> = [];
    const normalizedWord = word.toLowerCase();
    
    // Check context patterns first
    if (this.contextPatterns.has(normalizedWord)) {
      return this.contextPatterns.get(normalizedWord) || [];
    }
    
    // Generate suggestions based on edit distance
    for (const dictWord of this.dictionary) {
      const distance = this.calculateEditDistance(normalizedWord, dictWord);
      if (distance <= 2 && distance > 0) { // Allow up to 2 character differences
        suggestions.push({ word: dictWord, distance });
      }
    }
    
    // Sort by edit distance and return top suggestions
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxSuggestions)
      .map(s => s.word);
  }

  private analyzeContext(text: string, wordPosition: number): string {
    const words = text.split(/\s+/);
    const wordIndex = Math.floor(wordPosition / (text.length / words.length));
    
    const start = Math.max(0, wordIndex - 2);
    const end = Math.min(words.length, wordIndex + 3);
    
    return words.slice(start, end).join(' ');
  }

  private calculateConfidence(word: string, suggestions: string[]): number {
    if (suggestions.length === 0) return 0;
    
    const normalizedWord = word.toLowerCase();
    const bestSuggestion = suggestions[0];
    const editDistance = this.calculateEditDistance(normalizedWord, bestSuggestion);
    
    // Higher confidence for smaller edit distances and common patterns
    let confidence = Math.max(0, 1 - (editDistance / Math.max(word.length, bestSuggestion.length)));
    
    // Boost confidence for known patterns
    if (this.contextPatterns.has(normalizedWord)) {
      confidence = Math.min(1, confidence + 0.3);
    }
    
    // Boost confidence for very common words
    if (COMMON_WORDS.has(bestSuggestion)) {
      confidence = Math.min(1, confidence + 0.2);
    }
    
    return confidence;
  }

  private detectMisspellingType(word: string): 'misspelling' | 'grammar' | 'slang' | 'context' {
    const normalized = word.toLowerCase();
    
    // Common grammar-related patterns
    const grammarPatterns = ['there', 'their', 'they\'re', 'your', 'you\'re', 'its', 'it\'s', 'affect', 'effect'];
    if (grammarPatterns.includes(normalized)) {
      return 'grammar';
    }
    
    // Context-sensitive words
    const contextWords = ['accept', 'except', 'loose', 'lose', 'brake', 'break'];
    if (contextWords.includes(normalized)) {
      return 'context';
    }
    
    // Check for slang patterns (simplified)
    const slangPatterns = /^(gonna|wanna|shoulda|coulda|wouldnt|cant|dont|isnt)$/i;
    if (slangPatterns.test(word)) {
      return 'slang';
    }
    
    return 'misspelling';
  }

  public async checkSpelling(text: string): Promise<SpellCheckResult> {
    const words = text.match(/\b\w+\b/g) || [];
    const suggestions: SpellingSuggestion[] = [];
    const preservedRareWords: string[] = [];
    let correctedText = text;
    let totalConfidence = 0;
    let suggestionCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const position = text.indexOf(word);
      
      if (!this.isValidWord(word)) {
        // Check if it's a rare but valid word that should be preserved
        if (RARE_VALID_WORDS.has(word.toLowerCase())) {
          preservedRareWords.push(word);
          continue;
        }
        
        const wordSuggestions = this.generateSuggestions(word);
        
        if (wordSuggestions.length > 0) {
          const confidence = this.calculateConfidence(word, wordSuggestions);
          
          // Only suggest corrections with high confidence (>= 0.7)
          if (confidence >= 0.7) {
            const context = this.analyzeContext(text, position);
            const type = this.detectMisspellingType(word);
            
            suggestions.push({
              word,
              suggestions: wordSuggestions,
              position,
              context,
              confidence,
              type,
              preserveRare: RARE_VALID_WORDS.has(word.toLowerCase())
            });
            
            // Apply the best suggestion to corrected text
            const bestSuggestion = wordSuggestions[0];
            correctedText = correctedText.replace(new RegExp(`\\b${word}\\b`, 'g'), bestSuggestion);
            
            totalConfidence += confidence;
            suggestionCount++;
          }
        }
      }
    }

    return {
      suggestions,
      correctedText,
      confidence: suggestionCount > 0 ? totalConfidence / suggestionCount : 1,
      preservedRareWords
    };
  }

  public async validateWithContext(word: string, context: string): Promise<{ isValid: boolean; suggestions: string[]; confidence: number }> {
    if (this.isValidWord(word)) {
      return { isValid: true, suggestions: [], confidence: 1 };
    }

    const suggestions = this.generateSuggestions(word, 3);
    const confidence = this.calculateConfidence(word, suggestions);

    return {
      isValid: false,
      suggestions,
      confidence
    };
  }
}

export const spellChecker = new AdvancedSpellChecker();

// Utility function for batch processing
export const processBatchSpellCheck = async (texts: string[]): Promise<SpellCheckResult[]> => {
  const results = await Promise.all(
    texts.map(text => spellChecker.checkSpelling(text))
  );
  return results;
};

// Export for use in components
export { AdvancedSpellChecker };
