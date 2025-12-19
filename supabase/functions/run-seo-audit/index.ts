const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuditIssue {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  element?: string;
  recommendation?: string;
}

interface AuditResult {
  score: number;
  issues: AuditIssue[];
  recommendations: string[];
  metadata: {
    url: string;
    analyzedAt: string;
    responseTime: number;
    contentLength: number;
    statusCode: number;
  };
}

function analyzeHTML(html: string, url: string): AuditResult {
  const issues: AuditIssue[] = [];
  const recommendations: string[] = [];
  const startTime = Date.now();

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch) {
    issues.push({
      type: "missing-title",
      severity: "high",
      description: "Page is missing a title tag",
      recommendation: "Add a descriptive title tag (50-60 characters)"
    });
    recommendations.push("Add a compelling, keyword-rich title tag");
  } else {
    const title = titleMatch[1].trim();
    if (title.length === 0) {
      issues.push({
        type: "empty-title",
        severity: "high",
        description: "Title tag is empty",
        element: title,
        recommendation: "Add descriptive text to your title tag"
      });
    } else if (title.length < 30) {
      issues.push({
        type: "short-title",
        severity: "medium",
        description: "Title tag is too short (less than 30 characters)",
        element: title,
        recommendation: "Expand your title to 50-60 characters for better SEO"
      });
    } else if (title.length > 60) {
      issues.push({
        type: "long-title",
        severity: "low",
        description: "Title tag is too long (more than 60 characters)",
        element: title,
        recommendation: "Shorten your title to 50-60 characters to avoid truncation"
      });
    }
  }

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!metaDescMatch) {
    issues.push({
      type: "missing-meta-description",
      severity: "high",
      description: "Page is missing a meta description",
      recommendation: "Add a meta description (150-160 characters)"
    });
    recommendations.push("Add a compelling meta description to improve click-through rates");
  } else {
    const desc = metaDescMatch[1].trim();
    if (desc.length < 120) {
      issues.push({
        type: "short-meta-description",
        severity: "medium",
        description: "Meta description is too short",
        element: desc.substring(0, 50) + "...",
        recommendation: "Expand to 150-160 characters for optimal display"
      });
    } else if (desc.length > 160) {
      issues.push({
        type: "long-meta-description",
        severity: "low",
        description: "Meta description is too long",
        element: desc.substring(0, 50) + "...",
        recommendation: "Shorten to 150-160 characters to prevent truncation"
      });
    }
  }

  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    issues.push({
      type: "missing-h1",
      severity: "high",
      description: "Page is missing an H1 heading",
      recommendation: "Add a single, descriptive H1 heading"
    });
    recommendations.push("Add a clear H1 heading that describes the page content");
  } else if (h1Matches.length > 1) {
    issues.push({
      type: "multiple-h1",
      severity: "medium",
      description: `Found ${h1Matches.length} H1 tags (should only have one)`,
      recommendation: "Use only one H1 tag per page"
    });
  }

  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    issues.push({
      type: "missing-viewport",
      severity: "medium",
      description: "Missing viewport meta tag for mobile responsiveness",
      recommendation: "Add viewport meta tag for mobile optimization"
    });
    recommendations.push("Add viewport meta tag: <meta name='viewport' content='width=device-width, initial-scale=1'>");
  }

  if (!/<link\s+rel=["']canonical["']/i.test(html)) {
    issues.push({
      type: "missing-canonical",
      severity: "low",
      description: "Missing canonical URL",
      recommendation: "Add canonical link to prevent duplicate content issues"
    });
  }

  const ogTags = html.match(/<meta\s+property=["']og:/gi);
  if (!ogTags || ogTags.length < 3) {
    issues.push({
      type: "missing-og-tags",
      severity: "low",
      description: "Missing or incomplete Open Graph tags",
      recommendation: "Add Open Graph tags for better social media sharing"
    });
  }

  const images = html.match(/<img[^>]*>/gi);
  if (images) {
    const imagesWithoutAlt = images.filter(img => !img.match(/alt=["'][^"']*["']/i));
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: "missing-image-alt",
        severity: "medium",
        description: `Found ${imagesWithoutAlt.length} images without alt attributes`,
        recommendation: "Add descriptive alt text to all images"
      });
      recommendations.push("Add alt attributes to all images for accessibility and SEO");
    }
  }

  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  if (h2Count === 0) {
    issues.push({
      type: "no-h2-headings",
      severity: "low",
      description: "No H2 headings found",
      recommendation: "Add H2 headings to structure your content"
    });
  }

  const internalLinks = html.match(/<a\s+[^>]*href=["'][^"']*(#|\/)[^"']*["']/gi) || [];
  if (internalLinks.length < 3) {
    issues.push({
      type: "few-internal-links",
      severity: "low",
      description: "Very few internal links found",
      recommendation: "Add more internal links to improve site navigation and SEO"
    });
  }

  const hasJsonLd = /<script\s+type=["']application\/ld\+json["']/i.test(html);
  const hasMicrodata = /itemscope|itemprop/i.test(html);
  if (!hasJsonLd && !hasMicrodata) {
    issues.push({
      type: "missing-structured-data",
      severity: "low",
      description: "No structured data (Schema.org) found",
      recommendation: "Add JSON-LD structured data for rich snippets"
    });
  }

  const robotsMeta = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  if (robotsMeta && (robotsMeta[1].includes('noindex') || robotsMeta[1].includes('nofollow'))) {
    issues.push({
      type: "robots-restriction",
      severity: "high",
      description: "Page has robots restriction (noindex/nofollow)",
      element: robotsMeta[1],
      recommendation: "Remove noindex/nofollow unless intentional"
    });
  }

  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({
      type: "thin-content",
      severity: "medium",
      description: `Low word count (${wordCount} words)`,
      recommendation: "Aim for at least 300-500 words of quality content"
    });
    recommendations.push("Expand your content to provide more value to users");
  }

  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'high') score -= 15;
    else if (issue.severity === 'medium') score -= 10;
    else score -= 5;
  });
  score = Math.max(0, Math.min(100, score));

  if (recommendations.length === 0) {
    recommendations.push("Great job! Your page has good SEO fundamentals");
    recommendations.push("Continue monitoring and improving your content regularly");
    recommendations.push("Consider adding more internal links and updating content");
  }

  const responseTime = Date.now() - startTime;

  return {
    score,
    issues,
    recommendations,
    metadata: {
      url,
      analyzedAt: new Date().toISOString(),
      responseTime,
      contentLength: html.length,
      statusCode: 200
    }
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Fetching URL: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)'
        }
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch URL",
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Server returned ${response.status}`,
          details: `The URL returned a ${response.status} status code`
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const html = await response.text();
    console.log(`Fetched ${html.length} bytes from ${url}`);

    const auditResult = analyzeHTML(html, url);

    return new Response(
      JSON.stringify(auditResult),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
