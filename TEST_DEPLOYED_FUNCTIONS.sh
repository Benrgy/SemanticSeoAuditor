#!/bin/bash

# Test script for deployed Supabase Edge Functions
# Replace YOUR-PROJECT-REF and YOUR-ANON-KEY with your actual values

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
PROJECT_REF="YOUR-PROJECT-REF"
ANON_KEY="YOUR-ANON-KEY"
BASE_URL="https://${PROJECT_REF}.supabase.co/functions/v1"

echo -e "${YELLOW}=== Testing Supabase Edge Functions ===${NC}\n"

# Check if variables are set
if [ "$PROJECT_REF" = "YOUR-PROJECT-REF" ] || [ "$ANON_KEY" = "YOUR-ANON-KEY" ]; then
    echo -e "${RED}ERROR: Please update PROJECT_REF and ANON_KEY in this script${NC}"
    echo "Find these values in your Supabase Dashboard → Project Settings → API"
    exit 1
fi

echo -e "${GREEN}Configuration:${NC}"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: run-seo-audit
echo -e "${YELLOW}Test 1: run-seo-audit${NC}"
echo "Testing with https://example.com..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/run-seo-audit" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo "---"
echo ""

# Test 2: semantic-analysis
echo -e "${YELLOW}Test 2: semantic-analysis${NC}"
echo "Testing with sample content..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/semantic-analysis" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "content": "This is a sample website about SEO optimization and search engine ranking. We help businesses improve their online visibility through comprehensive SEO strategies, keyword research, and content optimization.",
    "keywords": ["SEO", "optimization", "ranking"],
    "options": {
      "includeCompetitorAnalysis": false,
      "maxTokens": 1000
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"

    if echo "$BODY" | grep -q "OpenAI"; then
        echo ""
        echo -e "${YELLOW}NOTE: This function requires an OpenAI API key${NC}"
        echo "Set it in Supabase Dashboard → Project Settings → API → Edge Function Secrets"
        echo "Key: OPENAI_API_KEY"
        echo "Value: sk-..."
    fi
fi

echo ""
echo "---"
echo ""

# Test 3: CORS Preflight
echo -e "${YELLOW}Test 3: CORS Preflight (OPTIONS request)${NC}"
echo "Testing run-seo-audit..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "${BASE_URL}/run-seo-audit" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ CORS configured correctly (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ CORS issue (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo -e "${YELLOW}=== Testing Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. If all tests passed, integrate functions into your frontend"
echo "2. Check Supabase Dashboard → Edge Functions → Logs for detailed logs"
echo "3. Monitor OpenAI usage if using semantic-analysis"
