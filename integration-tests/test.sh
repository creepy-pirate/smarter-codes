#!/bin/bash

# Define some colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Kill and remove any running containers
cleanup() {
  docker-compose -p sockshop-integration-test kill
  docker-compose -p sockshop-integration-test rm -f --all
}

# Catch unexpected failures, perform cleanup, and output an error message
trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"' HUP INT QUIT PIPE TERM

# Build and run the composed services
docker-compose -p sockshop-integration-test build && docker-compose -p sockshop-integration-test up -d

if [ $? -ne 0 ]; then
  printf "${RED}Docker Compose Failed${NC}\n"
  exit -1
fi

# Wait for the integration-tester service to complete and retrieve the exit code
TEST_EXIT_CODE=$(docker wait sockshop-integration-test_integration-tester_1)

# Output the logs for the test (for clarity)
docker logs sockshop-integration-test_integration-tester_1

# Check the exit code of the test and display the respective message
if [ "$TEST_EXIT_CODE" -eq 0 ]; then
  printf "${GREEN}Tests Passed${NC}\n"
else
  printf "${RED}Tests Failed${NC} - Exit Code: $TEST_EXIT_CODE\n"
fi

# Call the cleanup function
cleanup

# Exit the script with the same code as the test service code
exit $TEST_EXIT_CODE

