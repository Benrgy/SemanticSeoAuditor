# Edge Functions Comprehensive Test Suite

## Overview

This comprehensive test suite validates your Supabase Edge Functions deployment with production-ready testing capabilities including deployment validation, CORS verification, function execution tests, performance benchmarks, error handling, and integration testing.

## Quick Start

```bash
# Run all tests with default settings
./test-edge-functions.sh

# Run with verbose output
./test-edge-functions.sh --verbose

# Run with custom timeout
./test-edge-functions.sh --timeout 60

# Run in specific environment
./test-edge-functions.sh --env staging --verbose
```

## Prerequisites

### Required Tools
- `curl` - HTTP client for API requests
- `jq` - JSON processor for response parsing
- `bc` - Calculator for performance metrics
- `date` - Timestamp generation

Install on Debian/Ubuntu:
```bash
sudo apt-get install curl jq bc
```

Install on macOS:
```bash
brew install curl jq bc
```

### Environment Configuration

Ensure your `.env` file contains:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Test Categories

### 1. Deployment Validation Tests (3 tests)
- Environment variables presence check
- Supabase URL format validation
- Functions endpoint accessibility

### 2. CORS & Security Tests (4 tests)
- CORS OPTIONS request handling for both functions
- CORS headers validation
- Authentication requirement verification

### 3. Function Tests: run-seo-audit (6 tests)
- Valid URL processing
- Invalid URL error handling
- Missing URL parameter validation
- Non-HTTP protocol rejection
- Response structure validation
- Timeout handling

### 4. Function Tests: semantic-analysis (5 tests)
- Valid request processing with full payload
- Missing content parameter validation
- Missing URL parameter validation
- Fallback mode without OpenAI API key
- Large content handling (3000+ characters)

### 5. Performance Tests (2 tests)
- SEO audit response time (<10s threshold)
- Semantic analysis response time (<15s threshold)

### 6. Error Handling Tests (2 tests)
- Malformed JSON rejection
- Error response format validation

### 7. Integration Tests (2 tests)
- Concurrent request handling (3 parallel requests)
- Sequential request processing

**Total: 24 comprehensive tests**

## Command-Line Options

```
USAGE:
    test-edge-functions.sh [OPTIONS]

OPTIONS:
    -e, --env ENV           Set environment (dev/staging/prod) [default: dev]
    -v, --verbose           Enable verbose output with detailed logging
    -t, --timeout SECONDS   Set request timeout [default: 30]
    -h, --help              Show help message

EXIT CODES:
    0    All tests passed
    1    One or more tests failed
    2    Invalid arguments or setup error
```

## Features

### Color-Coded Output
- **Green (✓)**: Tests passed
- **Red (✗)**: Tests failed
- **Yellow (○)**: Tests skipped
- **Blue**: Section headers
- **Cyan**: Main headers

### Comprehensive Logging
- Timestamped log files in `test-logs/` directory
- Format: `test-run-YYYYMMDD_HHMMSS.log`
- Includes detailed request/response information
- Persistent test history

### Performance Metrics
- Response time tracking for each request
- Performance threshold validation
- Duration reporting in test logs

### Error Handling
- Proper cleanup of temporary files
- Graceful failure handling
- Detailed error messages
- Automatic retry logic (configurable)

### Parallel Test Support
- Concurrent request testing
- Background process management
- Process synchronization

## Test Examples

### Example 1: Basic Test Run

```bash
./test-edge-functions.sh
```

**Expected Output:**
```
===============================
  EDGE FUNCTIONS TEST SUITE
===============================

Configuration:
  Environment: dev
  Supabase URL: https://zaisbrmgprltcfhmtrsu.supabase.co
  Timeout: 30s
  Log File: test-logs/test-run-20251220_143052.log

>>> Deployment Validation Tests

Environment variables are present                           [✓] PASS
Supabase URL format is valid                                [✓] PASS
Functions endpoint is accessible                            [✓] PASS

>>> CORS & Security Tests

CORS OPTIONS request - run-seo-audit                        [✓] PASS
CORS OPTIONS request - semantic-analysis                    [✓] PASS
CORS headers are present                                    [✓] PASS
Authentication is required                                  [✓] PASS

...

===============================
  TEST SUMMARY
===============================

Total Tests:   24
Passed:        24
Failed:        0
Skipped:       0
Success Rate:  100.00%

Detailed log: test-logs/test-run-20251220_143052.log

✓ All tests passed!
```

### Example 2: Verbose Mode

```bash
./test-edge-functions.sh --verbose
```

Additional output includes:
- Environment setup details
- Request/response details
- Response times for each test
- Detailed error information

### Example 3: Custom Timeout

```bash
./test-edge-functions.sh --timeout 60
```

Sets maximum wait time to 60 seconds per request.

## Understanding Test Results

### Deployment Validation
These tests ensure your environment is correctly configured:
- **Environment variables**: Validates `.env` file setup
- **URL format**: Ensures Supabase URL is valid
- **Endpoint accessibility**: Confirms functions API is reachable

### CORS Tests
Critical for browser-based applications:
- **OPTIONS requests**: Validates preflight handling
- **CORS headers**: Ensures proper headers in responses
- **Authentication**: Verifies security requirements

### Function Execution Tests
Validates core functionality:
- **Happy path**: Tests succeed with valid inputs
- **Error cases**: Tests fail appropriately with invalid inputs
- **Edge cases**: Tests handle boundary conditions

### Performance Tests
Ensures acceptable response times:
- **SEO Audit**: Should complete within 10 seconds
- **Semantic Analysis**: Should complete within 15 seconds (with fallback)

### Integration Tests
Validates real-world usage:
- **Concurrent**: Multiple simultaneous requests
- **Sequential**: Series of dependent requests

## Troubleshooting

### Issue: "Environment variables not set"

**Cause:** Missing or invalid `.env` file

**Solution:**
```bash
# Check .env file exists
ls -la .env

# Verify contents
cat .env

# Ensure proper format
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Issue: "Missing required dependencies"

**Cause:** Required command-line tools not installed

**Solution:**
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install curl jq bc

# macOS
brew install curl jq bc
```

### Issue: "Functions endpoint is accessible" test fails

**Cause:** Functions not deployed or network issues

**Solution:**
1. Deploy functions via Supabase Dashboard
2. Verify Supabase URL is correct
3. Check network connectivity
4. Verify API key has correct permissions

### Issue: "Authentication is required" test fails

**Cause:** Function allows unauthenticated access (security issue)

**Solution:**
1. Check edge function code includes proper auth headers
2. Verify Supabase RLS policies
3. Redeploy function if needed

### Issue: Performance tests failing

**Cause:** Slow network or target URLs taking too long

**Solution:**
```bash
# Increase timeout threshold
./test-edge-functions.sh --timeout 60

# Check network connectivity
ping example.com

# Test target URL directly
curl -w "@curl-format.txt" -o /dev/null -s https://example.com
```

### Issue: All tests timing out

**Cause:** Functions not deployed or incorrect URL

**Solution:**
1. Verify functions are deployed:
   - Go to Supabase Dashboard
   - Navigate to Edge Functions
   - Check deployment status
2. Confirm function names match exactly:
   - `run-seo-audit`
   - `semantic-analysis`

## Advanced Usage

### Running Specific Test Categories

Edit the script and comment out unwanted test sections in the `run_all_tests()` function:

```bash
# Comment out sections you don't want to run
run_all_tests() {
    # print_section "Deployment Validation Tests"
    # ...

    print_section "Function Tests: run-seo-audit"
    # Only run SEO audit tests
    run_test "Valid URL returns audit results" test_seo_audit_valid_url
    # ...
}
```

### Custom Test Development

Add your own tests following the pattern:

```bash
test_custom_validation() {
    local data='{"url": "https://custom-test.com"}'

    if make_request "POST" "run-seo-audit" "${data}" "200"; then
        local body
        body="$(get_response_body)"

        # Your custom validation logic
        echo "${body}" | jq -e '.customField' >/dev/null
    else
        return 1
    fi
}

# Add to test suite
run_test "Custom validation check" test_custom_validation
```

### Environment-Specific Configuration

Create environment-specific configs:

```bash
# .env.dev
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-key

# .env.staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-key

# Run with specific env
ENV=staging ./test-edge-functions.sh --env staging
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Edge Functions Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup environment
        run: |
          echo "VITE_SUPABASE_URL=${{ secrets.SUPABASE_URL }}" >> .env
          echo "VITE_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> .env

      - name: Run tests
        run: |
          chmod +x test-edge-functions.sh
          ./test-edge-functions.sh --verbose

      - name: Upload test logs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-logs
          path: test-logs/
```

### GitLab CI Example

```yaml
test-functions:
  image: ubuntu:latest
  before_script:
    - apt-get update && apt-get install -y curl jq bc
    - echo "VITE_SUPABASE_URL=${SUPABASE_URL}" >> .env
    - echo "VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}" >> .env
  script:
    - chmod +x test-edge-functions.sh
    - ./test-edge-functions.sh --verbose
  artifacts:
    paths:
      - test-logs/
    when: always
```

## Best Practices

1. **Run tests before deployment**: Catch issues early
2. **Use verbose mode for debugging**: Get detailed information
3. **Review test logs**: Understand failures completely
4. **Set realistic timeouts**: Balance speed and reliability
5. **Test in staging first**: Validate before production
6. **Monitor performance trends**: Track response times over time
7. **Keep functions updated**: Regular testing ensures compatibility
8. **Document custom tests**: Make maintenance easier

## Performance Benchmarks

Based on typical execution:

| Test Category | Average Duration | Tests |
|---------------|------------------|-------|
| Deployment Validation | 2-5s | 3 |
| CORS & Security | 3-8s | 4 |
| run-seo-audit | 20-40s | 6 |
| semantic-analysis | 10-30s | 5 |
| Performance | 5-15s | 2 |
| Error Handling | 5-10s | 2 |
| Integration | 10-20s | 2 |
| **Total** | **55-128s** | **24** |

**Note:** Times vary based on network speed and target URL response times.

## Next Steps

1. **Deploy Functions**: Use Supabase Dashboard to deploy both edge functions
2. **Run Test Suite**: Execute `./test-edge-functions.sh`
3. **Review Results**: Check test output and logs
4. **Configure OpenAI**: Add `OPENAI_API_KEY` secret for semantic analysis
5. **Integrate**: Add to your CI/CD pipeline
6. **Monitor**: Set up regular test runs to catch regressions

## Support

For issues or questions:
1. Check test logs in `test-logs/` directory
2. Review function logs in Supabase Dashboard
3. Verify environment configuration
4. Test functions manually using curl commands
5. Check Supabase status page for outages
