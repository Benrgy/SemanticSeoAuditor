import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SemanticAnalysisRequest {
  url: string;
  content: string;
  keywords?: string[];
  options?: {
    includeCompetitorAnalysis?: boolean;
    includeContentGaps?: boolean;
    includeEntityAnalysis?: boolean;
    maxTokens?: number;
  };
}

interface SemanticAnalysisResponse {
  semanticScore: number;
  issues: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    implementationSteps: string[];
    expectedImpact: string;
  }>;
  recommendations: string[];
  contentAnalysis: {
    topicRelevance: number;
    semanticKeywords: string[];
    contentDepth: number;
    entityRecognition: string[];
    readabilityScore: number;
  };
  competitiveInsights?: {
    contentGaps: string[];
    keywordOpportunities: string[];
    competitorStrengths: string[];
  };
}

// Enhanced prompt templates
const SEMANTIC_ANALYSIS_PROMPT = `
You are an expert semantic SEO analyst with deep knowledge of search engine algorithms, natural language processing, and content optimization. Analyze the following website content for semantic SEO quality.

URL: {url}
Content Preview: {content}
Target Keywords: {keywords}

Provide a comprehensive semantic SEO analysis focusing on:

1. SEMANTIC RELEVANCE ASSESSMENT (0-100 score)
   - Topic clustering and semantic relationships
   - Keyword context and semantic variations
   - Content depth and topical authority
   - Entity mentions and relationships

2. CONTENT ANALYSIS METRICS
   - Topic relevance percentage
   - Semantic keyword identification
   - Content depth assessment
   - Entity recognition
   - Readability score

3. SEMANTIC SEO ISSUES
   Identify specific issues with:
   - Title and severity level
   - Detailed description
   - Actionable recommendation
   - Priority level
   - Implementation steps
   - Expected impact

4. STRATEGIC RECOMMENDATIONS
   - Content optimization strategies
   - Semantic keyword opportunities
   - Topic cluster development
   - Schema markup suggestions

Return ONLY valid JSON in this exact structure:
{
  "semanticScore": number,
  "issues": [
    {
      "title": "string",
      "description": "string", 
      "severity": "high|medium|low",
      "recommendation": "string",
      "priority": "high|medium|low",
      "implementationSteps": ["string"],
      "expectedImpact": "string"
    }
  ],
  "recommendations": ["string"],
  "contentAnalysis": {
    "topicRelevance": number,
    "semanticKeywords": ["string"],
    "contentDepth": number,
    "entityRecognition": ["string"],
    "readabilityScore": number
  }
}
`;

const COMPETITIVE_ANALYSIS_PROMPT = `
Based on the semantic analysis of this content, provide competitive insights:

URL: {url}
Content: {content}
Keywords: {keywords}

Analyze and provide:
1. Content gaps compared to top-ranking competitors
2. Keyword opportunities not being leveraged
3. Competitor content strengths to emulate

Return JSON with:
{
  "contentGaps": ["string"],
  "keywordOpportunities": ["string"], 
  "competitorStrengths": ["string"]
}
`;

async function callOpenAI(prompt: string, maxTokens: number = 1500): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert semantic SEO analyst. Provide detailed, actionable analysis in valid JSON format only. Do not include any text outside the JSON structure.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content received from OpenAI')
  }

  return content
}

function createFallbackAnalysis(url: string, content: string, keywords: string[]): SemanticAnalysisResponse {
  const contentLength = content.length
  const keywordDensity = keywords.length > 0 ? 
    keywords.reduce((acc, keyword) => acc + (content.toLowerCase().split(keyword.toLowerCase()).length - 1), 0) / contentLength * 100 : 0

  return {
    semanticScore: Math.max(40, Math.min(85, 60 + (keywordDensity * 2) + (contentLength > 1000 ? 10 : 0))),
    issues: [
      {
        title: 'Limited Semantic Analysis Available',
        description: 'Advanced AI analysis is temporarily unavailable. Basic semantic assessment provided.',
        severity: 'medium',
        recommendation: 'Ensure content includes semantic variations of target keywords and related entities.',
        priority: 'medium',
        implementationSteps: [
          'Add semantic keyword variations throughout content',
          'Include related entities and concepts',
          'Improve content depth and comprehensiveness',
          'Add structured data markup'
        ],
        expectedImpact: 'Improved semantic understanding and potential ranking improvements'
      }
    ],
    recommendations: [
      'Expand content with semantic keyword variations',
      'Add related entities and concepts to improve topical authority',
      'Implement structured data markup for better content understanding',
      'Create content clusters around main topics'
    ],
    contentAnalysis: {
      topicRelevance: Math.min(90, 70 + keywordDensity),
      semanticKeywords: keywords.slice(0, 5),
      contentDepth: Math.min(95, contentLength > 2000 ? 80 : contentLength > 1000 ? 65 : 45),
      entityRecognition: ['website', 'content', 'SEO', 'analysis'],
      readabilityScore: Math.min(95, 75 + (contentLength > 500 ? 10 : 0))
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = performance.now()

  try {
    const requestData: SemanticAnalysisRequest = await req.json()
    const { url, content, keywords = [], options = {} } = requestData

    // Input validation
    if (!url || !content) {
      return new Response(
        JSON.stringify({ error: 'URL and content are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Truncate content for API efficiency
    const maxContentLength = 3000
    const truncatedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '...'
      : content

    console.log(`Starting semantic analysis for ${url} (${content.length} chars, ${keywords.length} keywords)`)

    let analysis: SemanticAnalysisResponse

    try {
      // Main semantic analysis
      const semanticPrompt = SEMANTIC_ANALYSIS_PROMPT
        .replace('{url}', url)
        .replace('{content}', truncatedContent)
        .replace('{keywords}', keywords.join(', '))

      const semanticResult = await callOpenAI(semanticPrompt, options.maxTokens || 1500)
      const parsedAnalysis = JSON.parse(semanticResult)

      analysis = {
        semanticScore: parsedAnalysis.semanticScore || 70,
        issues: parsedAnalysis.issues || [],
        recommendations: parsedAnalysis.recommendations || [],
        contentAnalysis: parsedAnalysis.contentAnalysis || {
          topicRelevance: 70,
          semanticKeywords: keywords.slice(0, 5),
          contentDepth: 60,
          entityRecognition: [],
          readabilityScore: 75
        }
      }

      // Optional competitive analysis
      if (options.includeCompetitorAnalysis) {
        try {
          const competitivePrompt = COMPETITIVE_ANALYSIS_PROMPT
            .replace('{url}', url)
            .replace('{content}', truncatedContent.substring(0, 1500))
            .replace('{keywords}', keywords.join(', '))

          const competitiveResult = await callOpenAI(competitivePrompt, 800)
          const competitiveData = JSON.parse(competitiveResult)
          
          analysis.competitiveInsights = competitiveData
        } catch (competitiveError) {
          console.warn('Competitive analysis failed:', competitiveError)
          // Continue without competitive insights
        }
      }

    } catch (aiError) {
      console.error('AI analysis failed, using fallback:', aiError)
      analysis = createFallbackAnalysis(url, content, keywords)
    }

    const processingTime = performance.now() - startTime
    console.log(`Semantic analysis completed in ${processingTime.toFixed(2)}ms`)

    return new Response(
      JSON.stringify({
        ...analysis,
        metadata: {
          processingTime: `${processingTime.toFixed(2)}ms`,
          contentLength: content.length,
          keywordCount: keywords.length,
          analysisVersion: '2.0'
        }
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Processing-Time': `${processingTime.toFixed(2)}ms`
        },
        status: 200,
      },
    )

  } catch (error) {
    const processingTime = performance.now() - startTime
    console.error(`Semantic analysis error (${processingTime.toFixed(2)}ms):`, error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to perform semantic analysis',
        details: error.message,
        fallback: true
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Processing-Time': `${processingTime.toFixed(2)}ms`
        },
        status: 500,
      },
    )
  }
})