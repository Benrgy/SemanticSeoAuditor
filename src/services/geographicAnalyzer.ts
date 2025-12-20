export interface HreflangTag {
  lang: string;
  region?: string;
  href: string;
  isValid: boolean;
  issues?: string[];
}

export interface GeographicAnalysis {
  hreflangTags: HreflangTag[];
  localSeoScore: number;
  languagesDetected: string[];
  regionsDetected: string[];
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
}

export function analyzeGeographic(html: string, url: string): GeographicAnalysis {
  const issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }> = [];
  const recommendations: string[] = [];
  const hreflangTags: HreflangTag[] = [];
  const languagesDetected = new Set<string>();
  const regionsDetected = new Set<string>();

  const hreflangMatches = html.match(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*>/gi);

  if (hreflangMatches && hreflangMatches.length > 0) {
    hreflangMatches.forEach(match => {
      const langMatch = match.match(/hreflang=["']([^"']*)["']/i);
      const hrefMatch = match.match(/href=["']([^"']*)["']/i);

      if (langMatch && hrefMatch) {
        const langCode = langMatch[1];
        const href = hrefMatch[1];
        const parts = langCode.split('-');
        const lang = parts[0];
        const region = parts[1];

        languagesDetected.add(lang);
        if (region) regionsDetected.add(region);

        const isValid = /^[a-z]{2}(-[A-Z]{2})?$/.test(langCode) || langCode === 'x-default';
        const tagIssues: string[] = [];

        if (!isValid && langCode !== 'x-default') {
          tagIssues.push('Invalid hreflang format. Should be ISO 639-1 language code (e.g., "en", "es-MX")');
        }

        try {
          new URL(href);
        } catch {
          tagIssues.push('Invalid URL format');
        }

        hreflangTags.push({
          lang: langCode,
          region,
          href,
          isValid,
          issues: tagIssues.length > 0 ? tagIssues : undefined
        });
      }
    });

    const hasXDefault = hreflangTags.some(tag => tag.lang === 'x-default');
    if (!hasXDefault && hreflangTags.length > 1) {
      issues.push({
        type: 'missing-x-default',
        severity: 'medium',
        description: 'Missing x-default hreflang tag for international targeting',
        recommendation: 'Add an x-default hreflang tag to specify the default page for unmatched languages'
      });
    }

    const invalidTags = hreflangTags.filter(tag => !tag.isValid);
    if (invalidTags.length > 0) {
      issues.push({
        type: 'invalid-hreflang',
        severity: 'high',
        description: `Found ${invalidTags.length} invalid hreflang tag(s)`,
        recommendation: 'Fix hreflang tags to use proper ISO 639-1 language codes'
      });
    }

    const duplicateChecks = new Map<string, number>();
    hreflangTags.forEach(tag => {
      const count = duplicateChecks.get(tag.lang) || 0;
      duplicateChecks.set(tag.lang, count + 1);
    });

    const duplicates = Array.from(duplicateChecks.entries()).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate-hreflang',
        severity: 'high',
        description: `Found duplicate hreflang tags: ${duplicates.map(([lang]) => lang).join(', ')}`,
        recommendation: 'Remove duplicate hreflang tags - each language/region should appear only once'
      });
    }
  } else {
    const htmlLangMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
    if (htmlLangMatch) {
      languagesDetected.add(htmlLangMatch[1].split('-')[0]);
    }
  }

  const hasLocalBusinessSchema = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"LocalBusiness"/i.test(html);
  const hasOrganizationSchema = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"Organization"/i.test(html);

  const addressPattern = /\b\d{1,5}\s+[\w\s]{1,50}(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|place|pl)\b/i;
  const hasAddress = addressPattern.test(html.replace(/<[^>]*>/g, ' '));

  const phonePattern = /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/;
  const hasPhone = phonePattern.test(html.replace(/<[^>]*>/g, ' '));

  let localSeoScore = 100;

  if (languagesDetected.size > 1 && hreflangTags.length === 0) {
    issues.push({
      type: 'missing-hreflang',
      severity: 'high',
      description: 'Multi-language content detected without hreflang tags',
      recommendation: 'Add hreflang tags to help search engines serve the correct language version'
    });
    localSeoScore -= 20;
  }

  if (!hasLocalBusinessSchema && !hasOrganizationSchema && (hasAddress || hasPhone)) {
    issues.push({
      type: 'missing-local-schema',
      severity: 'medium',
      description: 'Local business information found but missing structured data',
      recommendation: 'Add LocalBusiness or Organization schema markup for better local SEO'
    });
    localSeoScore -= 15;
  }

  const hasGoogleMaps = /maps\.google\.com|google\.com\/maps/i.test(html);
  if ((hasAddress || hasPhone) && !hasGoogleMaps) {
    issues.push({
      type: 'missing-map-embed',
      severity: 'low',
      description: 'Local business detected without embedded map',
      recommendation: 'Consider embedding a Google Map to improve local user experience'
    });
    localSeoScore -= 10;
  }

  const ogLocaleMatch = html.match(/<meta[^>]*property=["']og:locale["'][^>]*content=["']([^"']*)["']/i);
  if (!ogLocaleMatch && languagesDetected.size > 0) {
    issues.push({
      type: 'missing-og-locale',
      severity: 'low',
      description: 'Missing og:locale meta tag for social sharing',
      recommendation: 'Add og:locale meta tag to specify language for social media platforms'
    });
    localSeoScore -= 5;
  }

  localSeoScore = Math.max(0, Math.min(100, localSeoScore));

  if (issues.length === 0) {
    recommendations.push('Good geographic targeting setup');
    if (hreflangTags.length > 0) {
      recommendations.push(`Successfully implementing hreflang for ${languagesDetected.size} language(s)`);
    }
  } else {
    if (hreflangTags.length === 0 && languagesDetected.size <= 1) {
      recommendations.push('If targeting multiple countries/languages, implement hreflang tags');
    }
    if (!hasLocalBusinessSchema && (hasAddress || hasPhone)) {
      recommendations.push('Add LocalBusiness schema markup to improve local search visibility');
    }
    if (languagesDetected.size > 1) {
      recommendations.push('Ensure each language version has proper hreflang implementation');
    }
  }

  return {
    hreflangTags,
    localSeoScore,
    languagesDetected: Array.from(languagesDetected),
    regionsDetected: Array.from(regionsDetected),
    issues,
    recommendations
  };
}
