#!/bin/bash

# Test Edge Function Deployment
# This script tests if the run-seo-audit edge function is deployed and working

echo "🧪 Testing Supabase Edge Function"
echo "=================================="
echo ""

# Read env vars
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)
ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ]; then
    echo "❌ Environment variables not set correctly"
    exit 1
fi

FUNCTION_URL="${SUPABASE_URL}/functions/v1/run-seo-audit"

echo "📡 Testing: $FUNCTION_URL"
echo ""

# Test the edge function
RESPONSE=$(curl -s -w "\n%{http_code}" --location --request POST "$FUNCTION_URL" \
  --header "Authorization: Bearer $ANON_KEY" \
  --header "Content-Type: application/json" \
  --data '{"url":"https://example.com"}' 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status Code: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Edge function is working!"
    echo ""
    echo "Response preview:"
    echo "$BODY" | head -c 500
    echo ""
    echo "..."
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Edge function NOT deployed (404 Not Found)"
    echo ""
    echo "To deploy, run:"
    echo "  npm install -g supabase"
    echo "  supabase link --project-ref zaisbrmgprltcfhmtrsu"
    echo "  supabase functions deploy run-seo-audit"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Authentication error (401 Unauthorized)"
    echo "Check your VITE_SUPABASE_ANON_KEY in .env"
else
    echo "❌ Unexpected error (HTTP $HTTP_CODE)"
    echo ""
    echo "Response:"
    echo "$BODY"
fi

echo ""
echo "=================================="
