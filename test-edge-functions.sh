#!/bin/bash

# Load environment variables
source .env

echo "==================================="
echo "Testing Supabase Edge Functions"
echo "==================================="
echo ""

# Test 1: run-seo-audit function
echo "📊 TEST 1: SEO Audit Function"
echo "-----------------------------------"
echo "Testing with example.com..."
echo ""

curl -X POST "${VITE_SUPABASE_URL}/functions/v1/run-seo-audit" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  | jq '.'

echo ""
echo ""

# Test 2: run-seo-audit with invalid URL
echo "🔍 TEST 2: SEO Audit - Invalid URL"
echo "-----------------------------------"
echo "Testing error handling..."
echo ""

curl -X POST "${VITE_SUPABASE_URL}/functions/v1/run-seo-audit" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-valid-url"}' \
  | jq '.'

echo ""
echo ""

# Test 3: run-seo-audit without URL
echo "⚠️  TEST 3: SEO Audit - Missing URL"
echo "-----------------------------------"
echo "Testing required parameter validation..."
echo ""

curl -X POST "${VITE_SUPABASE_URL}/functions/v1/run-seo-audit" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq '.'

echo ""
echo ""

# Test 4: CORS preflight
echo "🌐 TEST 4: CORS Preflight"
echo "-----------------------------------"
echo "Testing OPTIONS request..."
echo ""

curl -X OPTIONS "${VITE_SUPABASE_URL}/functions/v1/run-seo-audit" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"

echo ""
echo ""

# Test 5: semantic-analysis function (if OpenAI key is configured)
echo "🤖 TEST 5: Semantic Analysis Function"
echo "-----------------------------------"
echo "Testing semantic analysis (requires OpenAI API key)..."
echo ""

curl -X POST "${VITE_SUPABASE_URL}/functions/v1/semantic-analysis" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "content": "This is a sample website about web development and SEO optimization. We help businesses improve their online presence.",
    "keywords": ["SEO", "web development", "optimization"],
    "options": {
      "includeCompetitorAnalysis": false,
      "maxTokens": 1000
    }
  }' \
  | jq '.'

echo ""
echo "==================================="
echo "Testing Complete!"
echo "==================================="
