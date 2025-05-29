
import { useToast } from '@/hooks/use-toast';

// Comprehensive SCOWL-based word lists with better coverage
const COMMON_WORDS = new Set([
  // Basic common words
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'through', 'where', 'much', 'before', 'move', 'right', 'boy', 'old',
  'too', 'same', 'tell', 'does', 'set', 'three', 'must', 'here', 'life', 'never', 'world', 'still', 'hand', 'high', 'keep', 'last',
  // Extended common words
  'find', 'asked', 'going', 'house', 'point', 'school', 'number', 'part', 'turn', 'came', 'against', 'place', 'such', 'again', 'great',
  'put', 'end', 'why', 'try', 'kind', 'help', 'every', 'home', 'large', 'another', 'small', 'though', 'men', 'long', 'little', 'very',
  'own', 'called', 'upon', 'play', 'live', 'off', 'move', 'try', 'means', 'came', 'show', 'might', 'came', 'ask', 'water', 'form',
  'air', 'away', 'name', 'sentence', 'man', 'think', 'say', 'great', 'where', 'help', 'much', 'line', 'differ', 'turn', 'cause', 'move',
  'picture', 'again', 'change', 'play', 'spell', 'found', 'study', 'learn', 'should', 'america', 'world'
]);

const TECHNICAL_WORDS = new Set([
  // Programming and tech terms
  'algorithm', 'authentication', 'database', 'implementation', 'programming', 'javascript', 'typescript', 'react', 'component',
  'function', 'variable', 'parameter', 'asynchronous', 'synchronous', 'api', 'endpoint', 'middleware', 'framework', 'library',
  'repository', 'deployment', 'environment', 'configuration', 'optimization', 'debugging', 'refactoring', 'inheritance',
  'polymorphism', 'encapsulation', 'abstraction', 'recursion', 'iteration', 'validation', 'serialization', 'deserialization',
  'container', 'docker', 'kubernetes', 'microservices', 'serverless', 'blockchain', 'machine', 'learning', 'artificial',
  'intelligence', 'neural', 'network', 'data', 'science', 'analytics', 'visualization', 'business', 'intelligence',
  // Science and academic terms
  'research', 'analysis', 'hypothesis', 'experiment', 'methodology', 'statistical', 'correlation', 'coefficient', 'regression',
  'distribution', 'probability', 'variance', 'deviation', 'significance', 'p-value', 'confidence', 'interval'
]);

const RARE_VALID_WORDS = new Set([
  // Literary and sophisticated words
  'serendipity', 'ephemeral', 'ubiquitous', 'mellifluous', 'perspicacious', 'sesquipedalian', 'defenestration', 'petrichor',
  'saudade', 'hygge', 'schadenfreude', 'zeitgeist', 'wanderlust', 'fernweh', 'hiraeth', 'ubuntu', 'ikigai', 'lagom',
  'kalopsia', 'vellichor', 'apricity', 'phosphenes', 'eigengrau', 'kenopsia', 'liberosis', 'onism', 'zenosyne', 'sonder',
  'lachesism', 'altschmerz', 'jouska', 'chrysalism', 'vemödalen', 'adronitis', 'ellipsism', 'kuebiko', 'limerence',
  // Academic and scientific terms
  'antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosiss', 'floccinaucinihilipilification',
  'hippopotomonstrosesquippedaliophobia', 'pseudopseudohypoparathyroidism', 'supercalifragilisticexpialidocious'
]);

// Extended dictionary with better coverage
const DICTIONARY = new Set([...COMMON_WORDS, ...TECHNICAL_WORDS, ...RARE_VALID_WORDS]);

export interface SpellingSuggestion {
  word: string;
  suggestions: string[];
  position: number;
  context: string;
  confidence: number;
  type: 'misspelling' | 'grammar' | 'slang' | 'context' | 'typo';
  preserveRare?: boolean;
  errorType?: 'insertion' | 'deletion' | 'substitution' | 'transposition';
}

export interface SpellCheckResult {
  suggestions: SpellingSuggestion[];
  correctedText: string;
  confidence: number;
  preservedRareWords: string[];
  totalWords: number;
  errorCount: number;
}

class AdvancedSpellChecker {
  private dictionary: Set<string>;
  private contextPatterns: Map<string, string[]>;
  private commonTypos: Map<string, string>;
  private phoneticMap: Map<string, string>;

  constructor() {
    this.dictionary = DICTIONARY;
    this.initializeContextPatterns();
    this.initializeCommonTypos();
    this.initializePhoneticMap();
  }

  private initializeContextPatterns() {
    this.contextPatterns = new Map([
      // Common misspellings with high-confidence corrections
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
      ['consciense', ['conscience']],
      ['beleive', ['believe']],
      ['acheive', ['achieve']],
      ['wierd', ['weird']],
      ['freind', ['friend']],
      ['peice', ['piece']],
      ['thier', ['their']],
      ['publically', ['publicly']],
      ['priviledge', ['privilege']],
      ['difinately', ['definitely']],
      ['goverment', ['government']],
      ['enviroment', ['environment']],
      ['recomend', ['recommend']],
      ['tommorow', ['tomorrow']],
      ['occassion', ['occasion']],
      ['neccessary', ['necessary']],
      ['excercise', ['exercise']],
      ['apparantly', ['apparently']],
      ['occurance', ['occurrence']],
      ['liason', ['liaison']],
      ['maintainence', ['maintenance']],
      ['independance', ['independence']],
      ['posession', ['possession']],
      ['profesional', ['professional']],
      ['sucessful', ['successful']],
      ['transfered', ['transferred']],
      ['occured', ['occurred']],
      ['recieved', ['received']],
      ['bussiness', ['business']],
      ['adress', ['address']],
      ['comittee', ['committee']],
      ['embarrasing', ['embarrassing']],
      ['harrass', ['harass']],
      ['millenium', ['millennium']],
      ['perseverence', ['perseverance']],
      ['questionaire', ['questionnaire']],
      ['restaraunt', ['restaurant']],
      ['seperation', ['separation']],
      ['twelth', ['twelfth']],
      ['untill', ['until']],
      ['villian', ['villain']],
      ['wierd', ['weird']],
      
      // Context-aware homophones and confusables
      ['there', ['their', 'they\'re']],
      ['your', ['you\'re']],
      ['its', ['it\'s']],
      ['affect', ['effect']],
      ['accept', ['except']],
      ['loose', ['lose']],
      ['brake', ['break']],
      ['weather', ['whether']],
      ['piece', ['peace']],
      ['principle', ['principal']],
      ['compliment', ['complement']],
      ['capitol', ['capital']],
      ['stationary', ['stationery']],
      ['desert', ['dessert']],
      ['council', ['counsel']],
      ['advise', ['advice']],
      ['license', ['licence']],
      ['practice', ['practise']],
      ['than', ['then']],
      ['who', ['whom']],
      ['lay', ['lie']],
      ['further', ['farther']],
      ['less', ['fewer']],
      ['amount', ['number']],
      ['bring', ['take']],
      ['lend', ['borrow']],
      ['emigrate', ['immigrate']],
      ['imply', ['infer']],
      ['comprise', ['compose']],
      ['disinterested', ['uninterested']],
      ['continual', ['continuous']],
      ['historic', ['historical']],
      ['economic', ['economical']],
      ['ensure', ['insure', 'assure']],
      ['elicit', ['illicit']]
    ]);
  }

  private initializeCommonTypos() {
    this.commonTypos = new Map([
      // Common keyboard-based typos
      ['adn', 'and'],
      ['nad', 'and'],
      ['ajd', 'and'],
      ['hte', 'the'],
      ['teh', 'the'],
      ['het', 'the'],
      ['fo', 'of'],
      ['fro', 'for'],
      ['ofr', 'for'],
      ['ot', 'to'],
      ['oteh', 'other'],
      ['othe', 'other'],
      ['whih', 'which'],
      ['wich', 'which'],
      ['whcih', 'which'],
      ['taht', 'that'],
      ['htat', 'that'],
      ['jsut', 'just'],
      ['jstu', 'just'],
      ['woth', 'with'],
      ['wiht', 'with'],
      ['wtih', 'with'],
      ['form', 'from'],
      ['fomr', 'from'],
      ['been', 'bean'],
      ['bean', 'been'],
      ['dose', 'does'],
      ['deos', 'does'],
      ['wnat', 'want'],
      ['waht', 'what'],
      ['hwat', 'what'],
      ['whta', 'what'],
      ['peopel', 'people'],
      ['peolpe', 'people'],
      ['poeple', 'people'],
      ['becuase', 'because'],
      ['becase', 'because'],
      ['becasue', 'because'],
      ['sicne', 'since'],
      ['sinse', 'since'],
      ['thru', 'through'],
      ['thorugh', 'through'],
      ['throuhg', 'through'],
      ['alot', 'a lot'],
      ['alright', 'all right'],
      ['everytime', 'every time'],
      ['incase', 'in case'],
      ['inspite', 'in spite'],
      ['atleast', 'at least'],
      ['aswell', 'as well'],
      ['eachother', 'each other'],
      ['setup', 'set up'],
      ['login', 'log in'],
      ['backup', 'back up']
    ]);
  }

  private initializePhoneticMap() {
    this.phoneticMap = new Map([
      // Soundex-like phonetic mapping for better suggestions
      ['ph', 'f'],
      ['gh', 'f'],
      ['ck', 'k'],
      ['qu', 'kw'],
      ['x', 'ks'],
      ['z', 's'],
      ['c', 'k'],
      ['j', 'g'],
      ['y', 'i'],
      ['w', 'u']
    ]);
  }

  private calculateAdvancedEditDistance(word1: string, word2: string): number {
    const len1 = word1.length;
    const len2 = word2.length;
    
    // Initialize matrix
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    // Fill the matrix with dynamic programming
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const char1 = word1[i - 1].toLowerCase();
        const char2 = word2[j - 1].toLowerCase();
        
        if (char1 === char2) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          // Standard operations
          const substitution = matrix[i - 1][j - 1] + 1;
          const insertion = matrix[i][j - 1] + 1;
          const deletion = matrix[i - 1][j] + 1;
          
          let minCost = Math.min(substitution, insertion, deletion);
          
          // Transposition (Damerau-Levenshtein)
          if (i > 1 && j > 1 && 
              word1[i - 1] === word2[j - 2] && 
              word1[i - 2] === word2[j - 1]) {
            const transposition = matrix[i - 2][j - 2] + 1;
            minCost = Math.min(minCost, transposition);
          }
          
          // Keyboard proximity weighting
          const keyboardDistance = this.getKeyboardDistance(char1, char2);
          if (keyboardDistance < 2) {
            minCost = Math.min(minCost, matrix[i - 1][j - 1] + 0.5);
          }
          
          matrix[i][j] = minCost;
        }
      }
    }
    
    return matrix[len1][len2];
  }

  private getKeyboardDistance(char1: string, char2: string): number {
    const qwerty = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];
    
    let pos1 = null, pos2 = null;
    
    for (let row = 0; row < qwerty.length; row++) {
      for (let col = 0; col < qwerty[row].length; col++) {
        if (qwerty[row][col] === char1) pos1 = [row, col];
        if (qwerty[row][col] === char2) pos2 = [row, col];
      }
    }
    
    if (!pos1 || !pos2) return 5; // High distance for non-keyboard chars
    
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
  }

  private isValidWord(word: string): boolean {
    const normalized = word.toLowerCase().replace(/[^\w']/g, '');
    
    // Check direct dictionary match
    if (this.dictionary.has(normalized)) return true;
    
    // Check possessive forms
    if (normalized.endsWith("'s") && this.dictionary.has(normalized.slice(0, -2))) return true;
    
    // Check contractions
    const contractionMap = new Map([
      ["don't", 'do not'], ["won't", 'will not'], ["can't", 'cannot'],
      ["shouldn't", 'should not'], ["wouldn't", 'would not'], ["couldn't", 'could not'],
      ["mustn't", 'must not'], ["needn't", 'need not'], ["daren't", 'dare not'],
      ["mayn't", 'may not'], ["mightn't", 'might not'], ["oughtn't", 'ought not'],
      ["shan't", 'shall not'], ["isn't", 'is not'], ["aren't", 'are not'],
      ["wasn't", 'was not'], ["weren't", 'were not'], ["hasn't", 'has not'],
      ["haven't", 'have not'], ["hadn't", 'had not'], ["doesn't", 'does not'],
      ["didn't", 'did not'], ["you're", 'you are'], ["we're", 'we are'],
      ["they're", 'they are'], ["i'm", 'i am'], ["he's", 'he is'],
      ["she's", 'she is'], ["it's", 'it is'], ["we've", 'we have'],
      ["you've", 'you have'], ["they've", 'they have'], ["i've", 'i have'],
      ["you'll", 'you will'], ["we'll", 'we will'], ["they'll", 'they will'],
      ["i'll", 'i will'], ["he'll", 'he will'], ["she'll", 'she will'],
      ["it'll", 'it will'], ["you'd", 'you would'], ["we'd", 'we would'],
      ["they'd", 'they would'], ["i'd", 'i would'], ["he'd", 'he would'],
      ["she'd", 'she would'], ["it'd", 'it would']
    ]);
    
    if (contractionMap.has(normalized)) return true;
    
    // Check plural forms
    if (normalized.endsWith('s') && this.dictionary.has(normalized.slice(0, -1))) return true;
    if (normalized.endsWith('es') && this.dictionary.has(normalized.slice(0, -2))) return true;
    if (normalized.endsWith('ies') && this.dictionary.has(normalized.slice(0, -3) + 'y')) return true;
    
    // Check past tense forms
    if (normalized.endsWith('ed') && this.dictionary.has(normalized.slice(0, -2))) return true;
    if (normalized.endsWith('ed') && this.dictionary.has(normalized.slice(0, -1))) return true;
    
    // Check progressive forms
    if (normalized.endsWith('ing') && this.dictionary.has(normalized.slice(0, -3))) return true;
    if (normalized.endsWith('ing') && this.dictionary.has(normalized.slice(0, -3) + 'e')) return true;
    
    return false;
  }

  private generateAdvancedSuggestions(word: string, maxSuggestions: number = 8): string[] {
    const suggestions: Array<{ word: string; distance: number; confidence: number }> = [];
    const normalizedWord = word.toLowerCase();
    
    // Priority 1: Check common typos first
    if (this.commonTypos.has(normalizedWord)) {
      const correction = this.commonTypos.get(normalizedWord)!;
      suggestions.push({ word: correction, distance: 0, confidence: 0.95 });
    }
    
    // Priority 2: Check context patterns
    if (this.contextPatterns.has(normalizedWord)) {
      const contextSuggestions = this.contextPatterns.get(normalizedWord)!;
      contextSuggestions.forEach(suggestion => {
        suggestions.push({ word: suggestion, distance: 0.5, confidence: 0.9 });
      });
    }
    
    // Priority 3: Generate suggestions based on edit distance
    for (const dictWord of this.dictionary) {
      const distance = this.calculateAdvancedEditDistance(normalizedWord, dictWord);
      const maxDistance = Math.max(2, Math.floor(normalizedWord.length * 0.4));
      
      if (distance <= maxDistance && distance > 0) {
        let confidence = 1 - (distance / Math.max(normalizedWord.length, dictWord.length));
        
        // Boost confidence for common words
        if (COMMON_WORDS.has(dictWord)) confidence += 0.2;
        
        // Boost confidence for same length words
        if (Math.abs(normalizedWord.length - dictWord.length) <= 1) confidence += 0.1;
        
        // Boost confidence for similar starting letters
        if (normalizedWord[0] === dictWord[0]) confidence += 0.1;
        
        // Penalize very short words unless they're very common
        if (dictWord.length <= 2 && !COMMON_WORDS.has(dictWord)) confidence -= 0.3;
        
        suggestions.push({ word: dictWord, distance, confidence: Math.min(1, confidence) });
      }
    }
    
    // Sort by confidence and distance, then return top suggestions
    return suggestions
      .sort((a, b) => {
        if (Math.abs(a.confidence - b.confidence) < 0.1) {
          return a.distance - b.distance;
        }
        return b.confidence - a.confidence;
      })
      .slice(0, maxSuggestions)
      .filter(s => s.confidence > 0.3)
      .map(s => s.word);
  }

  private analyzeDetailedContext(text: string, wordPosition: number, targetWord: string): string {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    
    // Find the sentence containing the word
    let charCount = 0;
    let targetSentence = '';
    
    for (const sentence of sentences) {
      if (charCount + sentence.length >= wordPosition) {
        targetSentence = sentence.trim();
        break;
      }
      charCount += sentence.length + 1;
    }
    
    return targetSentence || text.substring(Math.max(0, wordPosition - 50), wordPosition + 50);
  }

  private calculateAdvancedConfidence(word: string, suggestions: string[], context: string): number {
    if (suggestions.length === 0) return 0;
    
    const normalizedWord = word.toLowerCase();
    const bestSuggestion = suggestions[0];
    const editDistance = this.calculateAdvancedEditDistance(normalizedWord, bestSuggestion);
    
    let confidence = Math.max(0, 1 - (editDistance / Math.max(word.length, bestSuggestion.length)));
    
    // High confidence boost for known patterns
    if (this.contextPatterns.has(normalizedWord) || this.commonTypos.has(normalizedWord)) {
      confidence = Math.min(1, confidence + 0.4);
    }
    
    // Boost for very common words
    if (COMMON_WORDS.has(bestSuggestion)) {
      confidence = Math.min(1, confidence + 0.25);
    }
    
    // Boost for technical words in technical context
    if (TECHNICAL_WORDS.has(bestSuggestion) && /\b(code|programming|software|development|technical|algorithm|data|system|computer)\b/i.test(context)) {
      confidence = Math.min(1, confidence + 0.15);
    }
    
    // Penalize if word is very short and suggestion is much longer
    if (word.length <= 3 && bestSuggestion.length > word.length + 2) {
      confidence *= 0.7;
    }
    
    // Boost if first letters match
    if (word[0]?.toLowerCase() === bestSuggestion[0]?.toLowerCase()) {
      confidence = Math.min(1, confidence + 0.1);
    }
    
    // Context-based confidence adjustment
    const contextWords = context.toLowerCase().split(/\s+/);
    const suggestionContext = contextWords.filter(w => COMMON_WORDS.has(w) || TECHNICAL_WORDS.has(w));
    if (suggestionContext.length > contextWords.length * 0.7) {
      confidence = Math.min(1, confidence + 0.1);
    }
    
    return confidence;
  }

  private detectErrorType(word: string, suggestion: string): 'insertion' | 'deletion' | 'substitution' | 'transposition' {
    const wordLen = word.length;
    const suggLen = suggestion.length;
    
    if (wordLen > suggLen) return 'insertion';
    if (wordLen < suggLen) return 'deletion';
    
    // Check for transposition
    for (let i = 0; i < wordLen - 1; i++) {
      if (word[i] === suggestion[i + 1] && word[i + 1] === suggestion[i]) {
        return 'transposition';
      }
    }
    
    return 'substitution';
  }

  private detectAdvancedMisspellingType(word: string, context: string): 'misspelling' | 'grammar' | 'slang' | 'context' | 'typo' {
    const normalized = word.toLowerCase();
    
    // Check for typos (common keyboard errors)
    if (this.commonTypos.has(normalized)) {
      return 'typo';
    }
    
    // Grammar-related patterns
    const grammarPatterns = ['there', 'their', 'they\'re', 'your', 'you\'re', 'its', 'it\'s', 'affect', 'effect', 'who', 'whom'];
    if (grammarPatterns.includes(normalized)) {
      return 'grammar';
    }
    
    // Context-sensitive words
    const contextWords = ['accept', 'except', 'loose', 'lose', 'brake', 'break', 'weather', 'whether', 'piece', 'peace'];
    if (contextWords.includes(normalized)) {
      return 'context';
    }
    
    // Slang patterns
    const slangPatterns = /^(gonna|wanna|shoulda|coulda|wouldnt|cant|dont|isnt|aint|dunno|kinda|sorta|lotta|gotta|hafta)$/i;
    if (slangPatterns.test(word)) {
      return 'slang';
    }
    
    return 'misspelling';
  }

  public async checkSpelling(text: string): Promise<SpellCheckResult> {
    const words = text.match(/\b\w+(?:'\w+)?\b/g) || [];
    const suggestions: SpellingSuggestion[] = [];
    const preservedRareWords: string[] = [];
    let correctedText = text;
    let totalConfidence = 0;
    let suggestionCount = 0;
    let errorCount = 0;

    console.log(`Starting spell check on ${words.length} words`);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const position = text.indexOf(word, i > 0 ? text.indexOf(words[i-1]) + words[i-1].length : 0);
      
      console.log(`Checking word: "${word}"`);
      
      if (!this.isValidWord(word)) {
        console.log(`"${word}" not found in dictionary`);
        
        // Check if it's a rare but valid word that should be preserved
        if (RARE_VALID_WORDS.has(word.toLowerCase())) {
          preservedRareWords.push(word);
          console.log(`Preserved rare word: "${word}"`);
          continue;
        }
        
        const wordSuggestions = this.generateAdvancedSuggestions(word);
        console.log(`Generated ${wordSuggestions.length} suggestions for "${word}":`, wordSuggestions);
        
        if (wordSuggestions.length > 0) {
          const context = this.analyzeDetailedContext(text, position, word);
          const confidence = this.calculateAdvancedConfidence(word, wordSuggestions, context);
          
          console.log(`Confidence for "${word}": ${confidence}`);
          
          // Increased threshold for higher accuracy
          if (confidence >= 0.75) {
            const type = this.detectAdvancedMisspellingType(word, context);
            const errorType = this.detectErrorType(word, wordSuggestions[0]);
            
            suggestions.push({
              word,
              suggestions: wordSuggestions,
              position,
              context,
              confidence,
              type,
              errorType,
              preserveRare: RARE_VALID_WORDS.has(word.toLowerCase())
            });
            
            // Apply the best suggestion to corrected text with word boundaries
            const bestSuggestion = wordSuggestions[0];
            const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            correctedText = correctedText.replace(wordRegex, bestSuggestion);
            
            totalConfidence += confidence;
            suggestionCount++;
            errorCount++;
            
            console.log(`Added suggestion for "${word}" -> "${bestSuggestion}" with confidence ${confidence}`);
          } else {
            console.log(`Skipped "${word}" due to low confidence: ${confidence}`);
          }
        } else {
          console.log(`No suggestions generated for "${word}"`);
          errorCount++;
        }
      } else {
        console.log(`"${word}" is valid`);
      }
    }

    const finalConfidence = suggestionCount > 0 ? totalConfidence / suggestionCount : 1;
    
    console.log(`Spell check complete. Found ${suggestions.length} suggestions out of ${errorCount} errors`);

    return {
      suggestions,
      correctedText,
      confidence: finalConfidence,
      preservedRareWords,
      totalWords: words.length,
      errorCount
    };
  }

  public async validateWithContext(word: string, context: string): Promise<{ isValid: boolean; suggestions: string[]; confidence: number }> {
    if (this.isValidWord(word)) {
      return { isValid: true, suggestions: [], confidence: 1 };
    }

    const suggestions = this.generateAdvancedSuggestions(word, 5);
    const confidence = this.calculateAdvancedConfidence(word, suggestions, context);

    return {
      isValid: false,
      suggestions,
      confidence
    };
  }
}

export const spellChecker = new AdvancedSpellChecker();

// Utility function for batch processing with improved performance
export const processBatchSpellCheck = async (texts: string[]): Promise<SpellCheckResult[]> => {
  console.log(`Processing batch of ${texts.length} texts`);
  const results = await Promise.all(
    texts.map((text, index) => {
      console.log(`Processing text ${index + 1}/${texts.length}`);
      return spellChecker.checkSpelling(text);
    })
  );
  console.log('Batch processing complete');
  return results;
};

// Export for use in components
export { AdvancedSpellChecker };
