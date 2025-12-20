export interface CompetitiveAnalysis {
  competitorUrls: string[];
  contentGaps: Array<{
    topic: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    opportunity: string;
  }>;
  keywordOpportunities: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    intent: string;
    reason: string;
  }>;
  competitorStrengths: Array<{
    area: string;
    description: string;
    actionItem: string;
  }>;
  backlink Comparison: {
    estimatedBacklinks: number;
    quality: 'high' | 'medium' | 'low';
    recommendations: string[];
  };
  domainMetrics: {
    estimatedAuthority: number;
    contentQuality: number;
    technicalSEO: number;
  };
  serpPositions: Array<{
    keyword: string;
    estimatedPosition: number;
    opportunity: string;
  }>;
}

export function analyzeCompetitive(html: string, url: string): CompetitiveAnalysis {
  const contentGaps: Array<{
    topic: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    opportunity: string;
  }> = [];

  const keywordOpportunities: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    intent: string;
    reason: string;
  }> = [];

  const competitorStrengths: Array<{
    area: string;
    description: string;
    actionItem: string;
  }> = [];

  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const wordCount = textContent.split(/\s+/).length;
  const headingCount = (html.match(/<h[1-6][^>]*>/gi) || []).length;
  const imageCount = (html.match(/<img[^>]*>/gi) || []).length;
  const linkCount = (html.match(/<a[^>]*href/gi) || []).length;
  const internalLinkCount = (html.match(/<a[^>]*href=["'][^"']*(#|\/)[^"']*["']/gi) || []).length;

  const hasVideoEmbed = /<iframe[^>]*(?:youtube|vimeo|wistia)/i.test(html);
  const hasInfographic = /infographic/i.test(textContent);
  const hasFAQ = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"FAQPage"/i.test(html);
  const hasSchema = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  const schemaCount = (html.match(/<script[^>]*type=["']application\/ld\+json["']/gi) || []).length;

  if (wordCount < 1000) {
    contentGaps.push({
      topic: 'Content Depth',
      priority: 'high',
      description: `Current content is ${wordCount} words. Competitors typically have 1000-2000+ words`,
      opportunity: 'Expand content with comprehensive information, examples, and detailed explanations'
    });
  }

  if (!hasVideoEmbed) {
    contentGaps.push({
      topic: 'Multimedia Content',
      priority: 'medium',
      description: 'No video content detected. Competitors often include video tutorials or explanations',
      opportunity: 'Add video content to increase engagement and dwell time'
    });
  }

  if (!hasFAQ) {
    contentGaps.push({
      topic: 'FAQ Section',
      priority: 'medium',
      description: 'No FAQ section found. Many competitors use FAQs to target long-tail queries',
      opportunity: 'Create comprehensive FAQ section with schema markup'
    });
  }

  if (schemaCount < 2) {
    contentGaps.push({
      topic: 'Structured Data',
      priority: 'high',
      description: `Only ${schemaCount} schema type(s) implemented. Competitors use multiple schema types`,
      opportunity: 'Implement additional schema types (Article, BreadcrumbList, Organization, FAQ)'
    });
  }

  if (imageCount < 3) {
    contentGaps.push({
      topic: 'Visual Content',
      priority: 'medium',
      description: 'Limited images found. Visual content improves engagement',
      opportunity: 'Add relevant images, diagrams, screenshots, or infographics'
    });
  }

  if (internalLinkCount < 5) {
    contentGaps.push({
      topic: 'Internal Linking',
      priority: 'medium',
      description: 'Weak internal linking structure compared to strong competitors',
      opportunity: 'Add contextual internal links to related content and important pages'
    });
  }

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].toLowerCase() : '';
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].toLowerCase() : '';

  const commonKeywords = ['best', 'top', 'guide', 'tutorial', 'how to', 'tips', 'review', 'compare', 'vs'];
  commonKeywords.forEach(keyword => {
    if (!title.includes(keyword) && !metaDesc.includes(keyword) && !textContent.includes(keyword)) {
      keywordOpportunities.push({
        keyword,
        searchVolume: 1000,
        difficulty: 45,
        intent: 'informational',
        reason: `High-value modifier not currently targeted in content`
      });
    }
  });

  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  keywordOpportunities.push({
    keyword: `${domain} alternative`,
    searchVolume: 500,
    difficulty: 35,
    intent: 'commercial',
    reason: 'Comparison keywords can capture competitor traffic'
  });

  keywordOpportunities.push({
    keyword: `${domain} review`,
    searchVolume: 800,
    difficulty: 40,
    intent: 'commercial',
    reason: 'Review content attracts high-intent users'
  });

  if (wordCount >= 800) {
    competitorStrengths.push({
      area: 'Content Volume',
      description: 'Good content length that matches or exceeds typical competitor content',
      actionItem: 'Maintain content quality and update regularly with fresh information'
    });
  }

  if (hasSchema) {
    competitorStrengths.push({
      area: 'Structured Data',
      description: 'Implementing structured data for better search visibility',
      actionItem: 'Continue expanding schema markup to more content types'
    });
  }

  if (linkCount >= 10) {
    competitorStrengths.push({
      area: 'Link Strategy',
      description: 'Good number of links providing additional resources',
      actionItem: 'Focus on acquiring more authoritative external backlinks'
    });
  }

  if (headingCount >= 5) {
    competitorStrengths.push({
      area: 'Content Structure',
      description: 'Well-structured content with proper heading hierarchy',
      actionItem: 'Ensure headings target relevant keywords and user questions'
    });
  }

  let estimatedAuthority = 50;
  if (wordCount >= 1000) estimatedAuthority += 10;
  if (schemaCount >= 2) estimatedAuthority += 10;
  if (internalLinkCount >= 5) estimatedAuthority += 10;
  if (hasVideoEmbed) estimatedAuthority += 5;
  estimatedAuthority = Math.min(100, estimatedAuthority);

  let contentQuality = 50;
  if (wordCount >= 800) contentQuality += 15;
  if (headingCount >= 5) contentQuality += 10;
  if (imageCount >= 3) contentQuality += 10;
  if (hasVideoEmbed) contentQuality += 10;
  if (hasFAQ) contentQuality += 5;
  contentQuality = Math.min(100, contentQuality);

  let technicalSEO = 50;
  if (schemaCount >= 1) technicalSEO += 15;
  if (internalLinkCount >= 5) technicalSEO += 15;
  const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
  if (hasCanonical) technicalSEO += 10;
  const hasSitemap = /sitemap/i.test(textContent);
  if (hasSitemap) technicalSEO += 10;
  technicalSEO = Math.min(100, technicalSEO);

  const estimatedBacklinks = Math.floor(estimatedAuthority * 10);
  const backlinkQuality: 'high' | 'medium' | 'low' = estimatedAuthority >= 70 ? 'high' : estimatedAuthority >= 50 ? 'medium' : 'low';

  const backLinkRecommendations: string[] = [
    'Focus on earning backlinks from high-authority domains in your niche',
    'Create linkable assets like original research, tools, or comprehensive guides',
    'Engage in guest posting on relevant industry websites',
    'Monitor competitor backlink profiles and identify link opportunities'
  ];

  const serpPositions = [
    {
      keyword: domain,
      estimatedPosition: 1,
      opportunity: 'Maintain brand keyword dominance'
    },
    {
      keyword: `${domain} review`,
      estimatedPosition: contentQuality >= 70 ? 5 : 15,
      opportunity: contentQuality >= 70 ? 'Strengthen position with more reviews and testimonials' : 'Create comprehensive review content to improve ranking'
    },
    {
      keyword: `best ${domain.split('.')[0]}`,
      estimatedPosition: estimatedAuthority >= 70 ? 8 : 20,
      opportunity: 'Target comparison keywords to capture more traffic'
    }
  ];

  return {
    competitorUrls: [],
    contentGaps,
    keywordOpportunities,
    competitorStrengths,
    backlinkComparison: {
      estimatedBacklinks,
      quality: backlinkQuality,
      recommendations: backlinkRecommendations
    },
    domainMetrics: {
      estimatedAuthority,
      contentQuality,
      technicalSEO
    },
    serpPositions
  };
}
