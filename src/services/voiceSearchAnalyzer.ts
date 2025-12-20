export interface QuestionPattern {
  type: 'who' | 'what' | 'when' | 'where' | 'why' | 'how';
  count: number;
  examples: string[];
}

export interface VoiceSearchAnalysis {
  questionPatterns: QuestionPattern[];
  featuredSnippetScore: number;
  conversationalKeywords: string[];
  answerReadinessScore: number;
  longTailOpportunities: Array<{
    keyword: string;
    intent: string;
    difficulty: 'low' | 'medium' | 'high';
    opportunity: string;
  }>;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
}

const QUESTION_WORDS = ['who', 'what', 'when', 'where', 'why', 'how', 'which', 'can', 'does', 'is', 'are', 'will', 'should'];
const CONVERSATIONAL_INDICATORS = ['best', 'top', 'find', 'near me', 'compare', 'vs', 'versus', 'review', 'guide', 'tutorial', 'tips'];

export function analyzeVoiceSearch(html: string, url: string): VoiceSearchAnalysis {
  const issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }> = [];
  const recommendations: string[] = [];
  const questionPatterns: QuestionPattern[] = [];
  const conversationalKeywords: string[] = [];
  const longTailOpportunities: Array<{
    keyword: string;
    intent: string;
    difficulty: 'low' | 'medium' | 'high';
    opportunity: string;
  }> = [];

  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const sentences = textContent.match(/[^.!?]+[.!?]+/g) || [];

  const questionCounts: { [key: string]: { count: number; examples: string[] } } = {
    who: { count: 0, examples: [] },
    what: { count: 0, examples: [] },
    when: { count: 0, examples: [] },
    where: { count: 0, examples: [] },
    why: { count: 0, examples: [] },
    how: { count: 0, examples: [] }
  };

  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    QUESTION_WORDS.forEach(word => {
      if (trimmed.startsWith(word + ' ')) {
        let category = word;
        if (['which', 'can', 'does', 'is', 'are', 'will', 'should'].includes(word)) {
          category = 'what';
        }
        if (questionCounts[category]) {
          questionCounts[category].count++;
          if (questionCounts[category].examples.length < 3) {
            questionCounts[category].examples.push(trimmed.substring(0, 100));
          }
        }
      }
    });
  });

  Object.entries(questionCounts).forEach(([type, data]) => {
    if (data.count > 0) {
      questionPatterns.push({
        type: type as 'who' | 'what' | 'when' | 'where' | 'why' | 'how',
        count: data.count,
        examples: data.examples
      });
    }
  });

  CONVERSATIONAL_INDICATORS.forEach(indicator => {
    if (textContent.includes(indicator)) {
      conversationalKeywords.push(indicator);
    }
  });

  const hasFAQSchema = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"FAQPage"/i.test(html);
  const hasHowToSchema = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"HowTo"/i.test(html);
  const hasQASchema = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"QAPage"/i.test(html);

  const listPattern = /<(ol|ul)[^>]*>[\s\S]*?<\/\1>/gi;
  const lists = html.match(listPattern) || [];
  const hasStructuredLists = lists.length > 0;

  const tableSummaryPattern = /<table[^>]*summary=["'][^"']*["'][^>]*>/i;
  const hasTables = /<table[^>]*>/i.test(html);
  const hasAccessibleTables = tableSummaryPattern.test(html);

  const headingStructure = (html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []).length;

  let featuredSnippetScore = 0;
  if (hasFAQSchema || hasHowToSchema || hasQASchema) featuredSnippetScore += 30;
  if (hasStructuredLists) featuredSnippetScore += 20;
  if (hasTables) featuredSnippetScore += 15;
  if (questionPatterns.length >= 3) featuredSnippetScore += 20;
  if (headingStructure >= 5) featuredSnippetScore += 15;

  featuredSnippetScore = Math.min(100, featuredSnippetScore);

  let answerReadinessScore = 0;
  if (questionPatterns.length > 0) answerReadinessScore += 25;
  if (conversationalKeywords.length >= 3) answerReadinessScore += 20;
  if (hasFAQSchema) answerReadinessScore += 20;
  if (hasHowToSchema) answerReadinessScore += 20;
  if (hasStructuredLists) answerReadinessScore += 15;

  answerReadinessScore = Math.min(100, answerReadinessScore);

  if (questionPatterns.length === 0) {
    issues.push({
      type: 'no-question-patterns',
      severity: 'high',
      description: 'No question-based content detected for voice search',
      recommendation: 'Add FAQ section or question-based headings (Who, What, When, Where, Why, How)'
    });
  }

  if (!hasFAQSchema && questionPatterns.length >= 3) {
    issues.push({
      type: 'missing-faq-schema',
      severity: 'medium',
      description: 'Question-based content found without FAQ schema',
      recommendation: 'Add FAQPage schema markup to improve voice search visibility'
    });
  }

  if (!hasHowToSchema && questionPatterns.some(p => p.type === 'how')) {
    issues.push({
      type: 'missing-howto-schema',
      severity: 'medium',
      description: 'How-to content detected without HowTo schema',
      recommendation: 'Add HowTo schema markup for step-by-step instructions'
    });
  }

  if (conversationalKeywords.length < 3) {
    issues.push({
      type: 'low-conversational-tone',
      severity: 'medium',
      description: 'Limited conversational keywords found',
      recommendation: 'Use more natural, conversational language that matches voice search queries'
    });
  }

  if (!hasStructuredLists && questionPatterns.length > 0) {
    issues.push({
      type: 'missing-structured-lists',
      severity: 'low',
      description: 'Question content without structured lists',
      recommendation: 'Use ordered or unordered lists to present step-by-step answers'
    });
  }

  const paragraphs = html.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
  const shortAnswerParagraphs = paragraphs.filter(p => {
    const text = p.replace(/<[^>]*>/g, '');
    return text.length >= 40 && text.length <= 300;
  });

  if (shortAnswerParagraphs.length === 0 && questionPatterns.length > 0) {
    issues.push({
      type: 'no-concise-answers',
      severity: 'medium',
      description: 'No concise answer paragraphs (40-300 characters) for featured snippets',
      recommendation: 'Provide direct, concise answers to questions in 40-300 character paragraphs'
    });
  }

  if (questionPatterns.length > 0) {
    questionPatterns.forEach(pattern => {
      longTailOpportunities.push({
        keyword: `${pattern.type} ${url.replace(/^https?:\/\//, '').split('/')[0]}`,
        intent: 'informational',
        difficulty: 'low',
        opportunity: `Create content targeting "${pattern.type}" questions with ${pattern.count} existing patterns`
      });
    });
  }

  if (conversationalKeywords.includes('near me') || textContent.includes('location')) {
    longTailOpportunities.push({
      keyword: 'near me queries',
      intent: 'local',
      difficulty: 'medium',
      opportunity: 'Optimize for local voice search queries with location-based content'
    });
  }

  if (conversationalKeywords.includes('best') || conversationalKeywords.includes('top')) {
    longTailOpportunities.push({
      keyword: 'comparison queries',
      intent: 'commercial',
      difficulty: 'medium',
      opportunity: 'Create comparison content for "best" and "top" voice searches'
    });
  }

  if (issues.length === 0) {
    recommendations.push('Good voice search optimization setup');
  } else {
    recommendations.push('Add FAQ or Q&A sections to target voice search queries');
    recommendations.push('Implement structured data (FAQ, HowTo, QAPage) for better visibility');
    recommendations.push('Use natural, conversational language throughout content');
    recommendations.push('Provide direct, concise answers in 40-300 character paragraphs');
  }

  return {
    questionPatterns,
    featuredSnippetScore,
    conversationalKeywords,
    answerReadinessScore,
    longTailOpportunities,
    issues,
    recommendations
  };
}
