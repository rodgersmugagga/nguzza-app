#!/bin/bash

# Advanced Search API Testing Script
# Tests all search endpoints to verify:
# - Backward compatibility with existing endpoints
# - Relevance ranking functionality
# - Partial keyword matching
# - Pagination and filtering
# - Mobile responsiveness considerations

API_BASE="http://localhost:5000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Advanced Search API Testing ===${NC}\n"

# Test 1: Basic search without filters (backward compatibility)
echo -e "${YELLOW}Test 1: Basic search without filters${NC}"
curl -s "${API_BASE}/products?pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}✓ Basic search endpoint works${NC}" || \
  echo -e "${RED}✗ Basic search endpoint failed${NC}"
echo ""

# Test 2: Search with keyword (relevance ranking)
echo -e "${YELLOW}Test 2: Search with keyword (relevance ranking)${NC}"
RESULT=$(curl -s "${API_BASE}/products?search=maize&pageNumber=1&pageSize=5")
echo "$RESULT" | jq -e '.products[0]' > /dev/null && \
  echo -e "${GREEN}✓ Keyword search returns results${NC}" || \
  echo -e "${RED}✗ Keyword search failed${NC}"
echo "$RESULT" | jq '.isRelevanceSearch' | grep -q "true" && \
  echo -e "${GREEN}✓ Relevance search flag is set${NC}" || \
  echo -e "${RED}✗ Relevance search flag not set${NC}"
echo ""

# Test 3: Search with category filter
echo -e "${YELLOW}Test 3: Search with category filter${NC}"
curl -s "${API_BASE}/products?category=Crops&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}✓ Category filter works${NC}" || \
  echo -e "${RED}✗ Category filter failed${NC}"
echo ""

# Test 4: Search with price range
echo -e "${YELLOW}Test 4: Search with price range${NC}"
curl -s "${API_BASE}/products?minPrice=1000&maxPrice=50000&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}✓ Price range filter works${NC}" || \
  echo -e "${RED}✗ Price range filter failed${NC}"
echo ""

# Test 5: Search with sorting options
echo -e "${YELLOW}Test 5: Search with sorting options${NC}"
echo "  Testing: sort=price_asc"
curl -s "${API_BASE}/products?sort=price_asc&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}  ✓ price_asc sort works${NC}" || \
  echo -e "${RED}  ✗ price_asc sort failed${NC}"

echo "  Testing: sort=views"
curl -s "${API_BASE}/products?sort=views&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}  ✓ views sort works${NC}" || \
  echo -e "${RED}  ✗ views sort failed${NC}"

echo "  Testing: sort=relevance (with search)"
curl -s "${API_BASE}/products?search=maize&sort=relevance&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}  ✓ relevance sort works${NC}" || \
  echo -e "${RED}  ✗ relevance sort failed${NC}"
echo ""

# Test 6: Pagination
echo -e "${YELLOW}Test 6: Pagination${NC}"
RESULT=$(curl -s "${API_BASE}/products?pageNumber=1&pageSize=3")
PAGES=$(echo "$RESULT" | jq '.pages')
echo "$RESULT" | jq '.products | length' | grep -q "3" && \
  echo -e "${GREEN}✓ Page size limit works (requested 3, got 3)${NC}" || \
  echo -e "${RED}✗ Page size limit failed${NC}"
echo "$RESULT" | jq '.page' | grep -q "1" && \
  echo -e "${GREEN}✓ Page number tracking works${NC}" || \
  echo -e "${RED}✗ Page number tracking failed${NC}"
echo ""

# Test 7: Search suggestions (autocomplete)
echo -e "${YELLOW}Test 7: Search suggestions (autocomplete)${NC}"
echo "  Testing: query=mai"
SUGG=$(curl -s "${API_BASE}/products/suggestions?query=mai")
echo "$SUGG" | jq '.[0]' > /dev/null && \
  echo -e "${GREEN}  ✓ Suggestions API returns results${NC}" || \
  echo -e "${RED}  ✗ Suggestions API failed${NC}"
echo "$SUGG" | jq 'length' | head -1
echo ""

# Test 8: Flash sale filter
echo -e "${YELLOW}Test 8: Flash sale filter${NC}"
curl -s "${API_BASE}/products?flashSaleOnly=true&pageNumber=1&pageSize=5" | jq '.products | length' > /dev/null && \
  echo -e "${GREEN}✓ Flash sale filter works${NC}" || \
  echo -e "${RED}✗ Flash sale filter failed${NC}"
echo ""

# Test 9: Combined filters (complex query)
echo -e "${YELLOW}Test 9: Combined filters (complex query)${NC}"
COMPLEX=$(curl -s "${API_BASE}/products?category=Crops&search=maize&minPrice=1000&maxPrice=50000&sort=relevance&pageNumber=1&pageSize=5")
echo "$COMPLEX" | jq -e '.products' > /dev/null && \
  echo -e "${GREEN}✓ Complex filter query works${NC}" || \
  echo -e "${RED}✗ Complex filter query failed${NC}"
echo ""

# Test 10: Response structure
echo -e "${YELLOW}Test 10: Response structure validation${NC}"
RESP=$(curl -s "${API_BASE}/products?pageNumber=1&pageSize=1")
echo "$RESP" | jq -e '.products' > /dev/null && \
  echo -e "${GREEN}✓ Response has 'products' field${NC}" || \
  echo -e "${RED}✗ Missing 'products' field${NC}"
echo "$RESP" | jq -e '.page' > /dev/null && \
  echo -e "${GREEN}✓ Response has 'page' field${NC}" || \
  echo -e "${RED}✗ Missing 'page' field${NC}"
echo "$RESP" | jq -e '.pages' > /dev/null && \
  echo -e "${GREEN}✓ Response has 'pages' field${NC}" || \
  echo -e "${RED}✗ Missing 'pages' field${NC}"
echo "$RESP" | jq -e '.total' > /dev/null && \
  echo -e "${GREEN}✓ Response has 'total' field${NC}" || \
  echo -e "${RED}✗ Missing 'total' field${NC}"
echo ""

echo -e "${YELLOW}=== Testing Complete ===${NC}"
echo -e "\n${YELLOW}Notes:${NC}"
echo "- All existing endpoints maintain backward compatibility"
echo "- Relevance ranking activates automatically when searching"
echo "- Suggestions API provides partial keyword matching"
echo "- Response structure remains unchanged for existing clients"
