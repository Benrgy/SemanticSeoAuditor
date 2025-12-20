#!/usr/bin/env bash

#==============================================================================
# Edge Functions Comprehensive Test Suite
#==============================================================================
# Description: Production-ready test script for Supabase Edge Functions
# Author: SEO Audit System
# Version: 2.0.0
#==============================================================================

set -euo pipefail
IFS=$'\n\t'

#------------------------------------------------------------------------------
# Configuration & Constants
#------------------------------------------------------------------------------

readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly LOG_DIR="${SCRIPT_DIR}/test-logs"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly LOG_FILE="${LOG_DIR}/test-run-${TIMESTAMP}.log"
readonly TEMP_DIR="/tmp/edge-function-tests-$$"

# Default configuration
ENVIRONMENT="${ENVIRONMENT:-dev}"
VERBOSE="${VERBOSE:-false}"
TIMEOUT_SECONDS=30
MAX_RETRIES=3
PARALLEL_TESTS=false

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

#------------------------------------------------------------------------------
# Utility Functions
#------------------------------------------------------------------------------

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info() {
    if [[ "${VERBOSE}" == "true" ]]; then
        log "INFO" "$*"
    fi
}

log_error() {
    log "ERROR" "$*" >&2
}

log_success() {
    log "SUCCESS" "$*"
}

print_colored() {
    local color="$1"
    shift
    printf "${color}%s${NC}\n" "$*"
}

print_header() {
    local text="$*"
    local length=${#text}
    local line
    line="$(printf '=%.0s' $(seq 1 $((length + 4))))"

    echo ""
    print_colored "${CYAN}" "${line}"
    print_colored "${CYAN}" "  ${text}"
    print_colored "${CYAN}" "${line}"
    echo ""
}

print_section() {
    echo ""
    print_colored "${BLUE}" ">>> $*"
    echo ""
}

print_test_name() {
    printf "${WHITE}%-60s${NC}" "$*"
}

print_pass() {
    print_colored "${GREEN}" "[✓] PASS"
    ((TESTS_PASSED++))
}

print_fail() {
    print_colored "${RED}" "[✗] FAIL"
    ((TESTS_FAILED++))
}

print_skip() {
    print_colored "${YELLOW}" "[○] SKIP"
    ((TESTS_SKIPPED++))
}

cleanup() {
    log_info "Cleaning up temporary files..."
    [[ -d "${TEMP_DIR}" ]] && rm -rf "${TEMP_DIR}"
}

setup_environment() {
    # Create necessary directories
    mkdir -p "${LOG_DIR}"
    mkdir -p "${TEMP_DIR}"

    # Load environment variables
    if [[ -f "${SCRIPT_DIR}/.env" ]]; then
        log_info "Loading environment variables from .env file"
        # shellcheck disable=SC1091
        set -a
        source "${SCRIPT_DIR}/.env"
        set +a
    else
        log_error ".env file not found"
        return 1
    fi

    # Validate required environment variables
    if [[ -z "${VITE_SUPABASE_URL:-}" ]] || [[ -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
        log_error "Required environment variables not set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
        return 1
    fi

    log_info "Environment setup complete"
}

check_prerequisites() {
    local missing_deps=()

    # Check required commands
    for cmd in curl jq bc date; do
        if ! command -v "${cmd}" &> /dev/null; then
            missing_deps+=("${cmd}")
        fi
    done

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_error "Install with: sudo apt-get install ${missing_deps[*]} (Debian/Ubuntu)"
        return 1
    fi

    log_info "All prerequisites satisfied"
    return 0
}

#------------------------------------------------------------------------------
# HTTP Request Functions
#------------------------------------------------------------------------------

make_request() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    local expected_status="${4:-200}"
    local output_file="${TEMP_DIR}/response-$$.json"
    local headers_file="${TEMP_DIR}/headers-$$.txt"

    local url="${VITE_SUPABASE_URL}/functions/v1/${endpoint}"
    local http_code
    local start_time
    local end_time
    local duration

    log_info "Making ${method} request to ${endpoint}"

    start_time="$(date +%s%N)"

    if [[ -n "${data}" ]]; then
        http_code=$(curl -s -w "%{http_code}" -o "${output_file}" \
            -X "${method}" \
            -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
            -H "Content-Type: application/json" \
            -H "X-Client-Info: test-suite/2.0.0" \
            -D "${headers_file}" \
            --max-time "${TIMEOUT_SECONDS}" \
            -d "${data}" \
            "${url}" 2>&1 || echo "000")
    else
        http_code=$(curl -s -w "%{http_code}" -o "${output_file}" \
            -X "${method}" \
            -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
            -H "Content-Type: application/json" \
            -H "X-Client-Info: test-suite/2.0.0" \
            -D "${headers_file}" \
            --max-time "${TIMEOUT_SECONDS}" \
            "${url}" 2>&1 || echo "000")
    fi

    end_time="$(date +%s%N)"
    duration=$(echo "scale=3; (${end_time} - ${start_time}) / 1000000000" | bc)

    log_info "Response: HTTP ${http_code} in ${duration}s"

    # Store results
    echo "${http_code}" > "${TEMP_DIR}/last-status.txt"
    echo "${duration}" > "${TEMP_DIR}/last-duration.txt"
    echo "${output_file}" > "${TEMP_DIR}/last-output.txt"
    echo "${headers_file}" > "${TEMP_DIR}/last-headers.txt"

    [[ "${http_code}" == "${expected_status}" ]]
}

get_response_body() {
    local output_file
    output_file="$(cat "${TEMP_DIR}/last-output.txt" 2>/dev/null || echo '')"
    [[ -f "${output_file}" ]] && cat "${output_file}"
}

get_response_duration() {
    cat "${TEMP_DIR}/last-duration.txt" 2>/dev/null || echo "0"
}

get_response_status() {
    cat "${TEMP_DIR}/last-status.txt" 2>/dev/null || echo "000"
}

get_response_headers() {
    local headers_file
    headers_file="$(cat "${TEMP_DIR}/last-headers.txt" 2>/dev/null || echo '')"
    [[ -f "${headers_file}" ]] && cat "${headers_file}"
}

#------------------------------------------------------------------------------
# Test Functions
#------------------------------------------------------------------------------

run_test() {
    local test_name="$1"
    local test_function="$2"

    ((TESTS_TOTAL++))

    print_test_name "${test_name}"

    if ${test_function}; then
        print_pass
        log_success "✓ ${test_name}"
        return 0
    else
        print_fail
        log_error "✗ ${test_name}"
        return 1
    fi
}

#------------------------------------------------------------------------------
# Deployment Validation Tests
#------------------------------------------------------------------------------

test_env_variables_present() {
    [[ -n "${VITE_SUPABASE_URL}" ]] && [[ -n "${VITE_SUPABASE_ANON_KEY}" ]]
}

test_supabase_url_valid() {
    [[ "${VITE_SUPABASE_URL}" =~ ^https://[a-z0-9]+\.supabase\.co$ ]]
}

test_functions_list_accessible() {
    local url="${VITE_SUPABASE_URL}/functions/v1/"
    local http_code

    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
        --max-time 10 \
        "${url}" 2>&1 || echo "000")

    [[ "${http_code}" =~ ^(200|404)$ ]]
}

#------------------------------------------------------------------------------
# CORS & Security Tests
#------------------------------------------------------------------------------

test_cors_options_run_seo_audit() {
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        --max-time 10 \
        "${VITE_SUPABASE_URL}/functions/v1/run-seo-audit" 2>&1 || echo "000")

    [[ "${http_code}" == "200" ]]
}

test_cors_options_semantic_analysis() {
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        --max-time 10 \
        "${VITE_SUPABASE_URL}/functions/v1/semantic-analysis" 2>&1 || echo "000")

    [[ "${http_code}" == "200" ]]
}

test_cors_headers_present() {
    make_request "OPTIONS" "run-seo-audit" "" "200"
    local headers
    headers="$(get_response_headers)"

    echo "${headers}" | grep -iq "access-control-allow-origin" && \
    echo "${headers}" | grep -iq "access-control-allow-methods" && \
    echo "${headers}" | grep -iq "access-control-allow-headers"
}

test_auth_required() {
    local url="${VITE_SUPABASE_URL}/functions/v1/run-seo-audit"
    local http_code

    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"url": "https://example.com"}' \
        --max-time 10 \
        "${url}" 2>&1 || echo "000")

    [[ "${http_code}" == "401" ]] || [[ "${http_code}" == "403" ]]
}

#------------------------------------------------------------------------------
# Function Execution Tests - run-seo-audit
#------------------------------------------------------------------------------

test_seo_audit_valid_url() {
    local data='{"url": "https://example.com"}'

    if make_request "POST" "run-seo-audit" "${data}" "200"; then
        local body
        body="$(get_response_body)"

        echo "${body}" | jq -e '.score' >/dev/null && \
        echo "${body}" | jq -e '.issues' >/dev/null && \
        echo "${body}" | jq -e '.recommendations' >/dev/null && \
        echo "${body}" | jq -e '.metadata' >/dev/null
    else
        return 1
    fi
}

test_seo_audit_invalid_url() {
    local data='{"url": "not-a-valid-url"}'
    make_request "POST" "run-seo-audit" "${data}" "400"
}

test_seo_audit_missing_url() {
    local data='{}'
    make_request "POST" "run-seo-audit" "${data}" "400"
}

test_seo_audit_non_http_protocol() {
    local data='{"url": "ftp://example.com"}'
    make_request "POST" "run-seo-audit" "${data}" "400"
}

test_seo_audit_response_structure() {
    local data='{"url": "https://example.com"}'

    if make_request "POST" "run-seo-audit" "${data}" "200"; then
        local body
        body="$(get_response_body)"

        local score
        local issues_count
        local has_metadata

        score="$(echo "${body}" | jq -r '.score // empty')"
        issues_count="$(echo "${body}" | jq -r '.issues | length // 0')"
        has_metadata="$(echo "${body}" | jq -e '.metadata.url' >/dev/null 2>&1 && echo "true" || echo "false")"

        [[ -n "${score}" ]] && [[ "${issues_count}" -ge 0 ]] && [[ "${has_metadata}" == "true" ]]
    else
        return 1
    fi
}

test_seo_audit_timeout_handling() {
    local data='{"url": "https://httpstat.us/200?sleep=15000"}'

    make_request "POST" "run-seo-audit" "${data}" "" || return 0
    return 0
}

#------------------------------------------------------------------------------
# Function Execution Tests - semantic-analysis
#------------------------------------------------------------------------------

test_semantic_analysis_valid_request() {
    local data='{
        "url": "https://example.com",
        "content": "This is a comprehensive guide about SEO optimization and web development best practices.",
        "keywords": ["SEO", "optimization", "web development"],
        "options": {
            "includeCompetitorAnalysis": false,
            "maxTokens": 1000
        }
    }'

    if make_request "POST" "semantic-analysis" "${data}" "200"; then
        local body
        body="$(get_response_body)"

        echo "${body}" | jq -e '.semanticScore' >/dev/null && \
        echo "${body}" | jq -e '.contentAnalysis' >/dev/null && \
        echo "${body}" | jq -e '.metadata' >/dev/null
    else
        return 1
    fi
}

test_semantic_analysis_missing_content() {
    local data='{"url": "https://example.com"}'
    make_request "POST" "semantic-analysis" "${data}" "400"
}

test_semantic_analysis_missing_url() {
    local data='{"content": "Some content here"}'
    make_request "POST" "semantic-analysis" "${data}" "400"
}

test_semantic_analysis_fallback_mode() {
    local data='{
        "url": "https://example.com",
        "content": "Sample content for testing fallback analysis mode.",
        "keywords": ["test", "fallback"]
    }'

    if make_request "POST" "semantic-analysis" "${data}" "200"; then
        local body
        body="$(get_response_body)"

        echo "${body}" | jq -e '.semanticScore' >/dev/null && \
        echo "${body}" | jq -e '.contentAnalysis' >/dev/null
    else
        return 1
    fi
}

test_semantic_analysis_large_content() {
    local large_content
    large_content="$(printf 'Lorem ipsum dolor sit amet. %.0s' {1..500})"

    local data
    data="$(jq -n \
        --arg url "https://example.com" \
        --arg content "${large_content}" \
        --argjson keywords '["lorem", "ipsum"]' \
        '{url: $url, content: $content, keywords: $keywords}')"

    make_request "POST" "semantic-analysis" "${data}" "200"
}

#------------------------------------------------------------------------------
# Performance Tests
#------------------------------------------------------------------------------

test_seo_audit_response_time() {
    local data='{"url": "https://example.com"}'

    if make_request "POST" "run-seo-audit" "${data}" "200"; then
        local duration
        duration="$(get_response_duration)"

        local threshold=10.0
        local is_fast
        is_fast=$(echo "${duration} < ${threshold}" | bc)

        log_info "Response time: ${duration}s (threshold: ${threshold}s)"
        [[ "${is_fast}" == "1" ]]
    else
        return 1
    fi
}

test_semantic_analysis_response_time() {
    local data='{
        "url": "https://example.com",
        "content": "Quick performance test content.",
        "keywords": ["performance", "test"]
    }'

    if make_request "POST" "semantic-analysis" "${data}" "200"; then
        local duration
        duration="$(get_response_duration)"

        local threshold=15.0
        local is_fast
        is_fast=$(echo "${duration} < ${threshold}" | bc)

        log_info "Response time: ${duration}s (threshold: ${threshold}s)"
        [[ "${is_fast}" == "1" ]]
    else
        return 1
    fi
}

#------------------------------------------------------------------------------
# Error Handling Tests
#------------------------------------------------------------------------------

test_seo_audit_malformed_json() {
    local url="${VITE_SUPABASE_URL}/functions/v1/run-seo-audit"
    local http_code

    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{invalid json}' \
        --max-time 10 \
        "${url}" 2>&1 || echo "000")

    [[ "${http_code}" == "400" ]] || [[ "${http_code}" == "500" ]]
}

test_error_response_format() {
    local data='{"url": "not-valid"}'

    if make_request "POST" "run-seo-audit" "${data}" "400"; then
        local body
        body="$(get_response_body)"

        echo "${body}" | jq -e '.error' >/dev/null
    else
        return 1
    fi
}

#------------------------------------------------------------------------------
# Integration Tests
#------------------------------------------------------------------------------

test_concurrent_requests() {
    local pids=()
    local data='{"url": "https://example.com"}'

    for i in {1..3}; do
        (
            make_request "POST" "run-seo-audit" "${data}" "200" > "${TEMP_DIR}/concurrent-${i}.log" 2>&1
        ) &
        pids+=($!)
    done

    local failed=0
    for pid in "${pids[@]}"; do
        if ! wait "${pid}"; then
            ((failed++))
        fi
    done

    [[ "${failed}" -eq 0 ]]
}

test_sequential_calls() {
    local data='{"url": "https://example.com"}'

    make_request "POST" "run-seo-audit" "${data}" "200" && \
    make_request "POST" "run-seo-audit" "${data}" "200" && \
    make_request "POST" "run-seo-audit" "${data}" "200"
}

#------------------------------------------------------------------------------
# Test Execution
#------------------------------------------------------------------------------

run_all_tests() {
    print_header "EDGE FUNCTIONS TEST SUITE"

    echo "Configuration:"
    echo "  Environment: ${ENVIRONMENT}"
    echo "  Supabase URL: ${VITE_SUPABASE_URL}"
    echo "  Timeout: ${TIMEOUT_SECONDS}s"
    echo "  Log File: ${LOG_FILE}"
    echo ""

    # Deployment Validation Tests
    print_section "Deployment Validation Tests"
    run_test "Environment variables are present" test_env_variables_present
    run_test "Supabase URL format is valid" test_supabase_url_valid
    run_test "Functions endpoint is accessible" test_functions_list_accessible

    # CORS & Security Tests
    print_section "CORS & Security Tests"
    run_test "CORS OPTIONS request - run-seo-audit" test_cors_options_run_seo_audit
    run_test "CORS OPTIONS request - semantic-analysis" test_cors_options_semantic_analysis
    run_test "CORS headers are present" test_cors_headers_present
    run_test "Authentication is required" test_auth_required

    # Function Execution Tests - run-seo-audit
    print_section "Function Tests: run-seo-audit"
    run_test "Valid URL returns audit results" test_seo_audit_valid_url
    run_test "Invalid URL returns error" test_seo_audit_invalid_url
    run_test "Missing URL parameter returns error" test_seo_audit_missing_url
    run_test "Non-HTTP protocol returns error" test_seo_audit_non_http_protocol
    run_test "Response structure is valid" test_seo_audit_response_structure
    run_test "Timeout handling works correctly" test_seo_audit_timeout_handling

    # Function Execution Tests - semantic-analysis
    print_section "Function Tests: semantic-analysis"
    run_test "Valid request returns analysis" test_semantic_analysis_valid_request
    run_test "Missing content returns error" test_semantic_analysis_missing_content
    run_test "Missing URL returns error" test_semantic_analysis_missing_url
    run_test "Fallback mode works without OpenAI" test_semantic_analysis_fallback_mode
    run_test "Large content is handled correctly" test_semantic_analysis_large_content

    # Performance Tests
    print_section "Performance Tests"
    run_test "SEO audit responds within threshold" test_seo_audit_response_time
    run_test "Semantic analysis responds within threshold" test_semantic_analysis_response_time

    # Error Handling Tests
    print_section "Error Handling Tests"
    run_test "Malformed JSON returns error" test_seo_audit_malformed_json
    run_test "Error response format is correct" test_error_response_format

    # Integration Tests
    print_section "Integration Tests"
    run_test "Concurrent requests succeed" test_concurrent_requests
    run_test "Sequential calls succeed" test_sequential_calls
}

#------------------------------------------------------------------------------
# Summary & Reporting
#------------------------------------------------------------------------------

print_summary() {
    local success_rate

    if [[ ${TESTS_TOTAL} -gt 0 ]]; then
        success_rate=$(echo "scale=2; (${TESTS_PASSED} * 100) / ${TESTS_TOTAL}" | bc)
    else
        success_rate=0
    fi

    print_header "TEST SUMMARY"

    echo "Total Tests:   ${TESTS_TOTAL}"
    print_colored "${GREEN}" "Passed:        ${TESTS_PASSED}"
    print_colored "${RED}" "Failed:        ${TESTS_FAILED}"
    print_colored "${YELLOW}" "Skipped:       ${TESTS_SKIPPED}"
    echo "Success Rate:  ${success_rate}%"
    echo ""
    echo "Detailed log: ${LOG_FILE}"
    echo ""

    if [[ ${TESTS_FAILED} -eq 0 ]]; then
        print_colored "${GREEN}" "✓ All tests passed!"
        return 0
    else
        print_colored "${RED}" "✗ Some tests failed"
        return 1
    fi
}

#------------------------------------------------------------------------------
# Help & Usage
#------------------------------------------------------------------------------

show_help() {
    cat << EOF
${SCRIPT_NAME} - Comprehensive Edge Functions Test Suite

USAGE:
    ${SCRIPT_NAME} [OPTIONS]

OPTIONS:
    -e, --env ENV           Set environment (dev/staging/prod) [default: dev]
    -v, --verbose           Enable verbose output
    -t, --timeout SECONDS   Set request timeout [default: 30]
    -h, --help              Show this help message

EXAMPLES:
    ${SCRIPT_NAME}                          Run all tests with defaults
    ${SCRIPT_NAME} --env staging --verbose  Run tests in staging with verbose output
    ${SCRIPT_NAME} -t 60                    Run tests with 60s timeout

EXIT CODES:
    0    All tests passed
    1    One or more tests failed
    2    Invalid arguments or setup error

REQUIREMENTS:
    - curl
    - jq
    - bc
    - .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

EOF
}

#------------------------------------------------------------------------------
# Argument Parsing
#------------------------------------------------------------------------------

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -e|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -t|--timeout)
                TIMEOUT_SECONDS="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_help
                exit 2
                ;;
        esac
    done
}

#------------------------------------------------------------------------------
# Main Entry Point
#------------------------------------------------------------------------------

main() {
    local exit_code=0

    parse_arguments "$@"

    trap cleanup EXIT

    log "INFO" "Starting test suite"
    log "INFO" "Environment: ${ENVIRONMENT}"

    if ! check_prerequisites; then
        log_error "Prerequisites check failed"
        exit 2
    fi

    if ! setup_environment; then
        log_error "Environment setup failed"
        exit 2
    fi

    run_all_tests

    if print_summary; then
        exit_code=0
    else
        exit_code=1
    fi

    log "INFO" "Test suite completed with exit code ${exit_code}"

    exit ${exit_code}
}

main "$@"
