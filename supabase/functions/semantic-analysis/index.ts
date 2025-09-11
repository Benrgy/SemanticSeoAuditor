import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SemanticAnalysisRequest {
  url: string;
  content: string;
  keywords?: string[];
}

interface SemanticAnalysisResponse {
  semanticScore: number;
  issues: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  recommendations: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, content, keywords = [] }: SemanticAnalysisRequest = await req.json()

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Prepare prompt for semantic SEO analysis
    const prompt = `
    Analyze the following website content for semantic SEO quality:
    
    URL: ${url}
    Content: ${content.substring(0, 2000)}...
    Target Keywords: ${keywords.join(', ')}
    
    Please provide:
    1. A semantic relevance score (0-100)
    2. Specific semantic SEO issues found
    3. Actionable recommendations for improvement
    
    Focus on:
    - Topic clustering and semantic relationships
    - Keyword context and semantic variations
    - Content depth and topical authority
    - Schema markup opportunities
    - Related entity mentions
    
    Return the response in JSON format with the following structure:
    {
      "semanticScore": number,
      "issues": [
        {
          "title": "string",
          "description": "string", 
          "severity": "high|medium|low",
          "recommendation": "string"
        }
      ],
      "recommendations": ["string"]
    }
    `

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert semantic SEO analyst. Provide detailed, actionable semantic SEO analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const analysisText = openaiData.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis received from OpenAI')
    }

    // Parse the JSON response from OpenAI
    let analysis: SemanticAnalysisResponse
    try {
      analysis = JSON.parse(analysisText)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        semanticScore: 70,
        issues: [
          {
            title: 'Semantic Analysis Unavailable',
            description: 'Unable to perform detailed semantic analysis at this time.',
            severity: 'medium',
            recommendation: 'Please try again later or contact support for assistance.'
          }
        ],
        recommendations: ['Improve content semantic depth', 'Add related keywords and entities']
      }
    }

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Semantic analysis error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to perform semantic analysis',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})