#!/bin/bash

# Health Check Script for Create Anything Application
# This script monitors the health of the web application and its dependencies

set -e

# Configuration
WEB_URL=${WEB_URL:-http://localhost:4000}
HEALTH_ENDPOINT="/health"
TIMEOUT=${TIMEOUT:-10}
MAX_RETRIES=${MAX_RETRIES:-3}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "OK")
            echo -e "${GREEN}✓ $message${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}✗ $message${NC}"
            ;;
        *)
            echo -e "$message"
            ;;
    esac
}

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if curl -f -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
            return 0
        fi
        retry_count=$((retry_count + 1))
        sleep 2
    done
    return 1
}

# Function to check database connection
check_database() {
    if [ -n "$DATABASE_URL" ]; then
        # Simple database connectivity check
        if command -v psql > /dev/null 2>&1; then
            if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
                return 0
            fi
        else
            print_status "WARN" "PostgreSQL client not found, skipping database check"
            return 0
        fi
    fi
    return 1
}

# Function to check SSL certificate
check_ssl() {
    local domain=$1
    if [ -n "$domain" ]; then
        if echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Function to check disk space
check_disk_space() {
    local threshold=${DISK_THRESHOLD:-80}
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt "$threshold" ]; then
        return 0
    fi
    return 1
}

# Function to check memory usage
check_memory() {
    local threshold=${MEMORY_THRESHOLD:-90}
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ "$usage" -lt "$threshold" ]; then
        return 0
    fi
    return 1
}

# Main health check
echo "🏥 Create Anything Health Check"
echo "================================"

# Check Web Application
echo -n "Checking web application... "
if check_http "$WEB_URL$HEALTH_ENDPOINT"; then
    print_status "OK" "Web application is responding"
else
    print_status "ERROR" "Web application is not responding"
    exit 1
fi

# Check Database
echo -n "Checking database connection... "
if check_database; then
    print_status "OK" "Database is accessible"
else
    print_status "ERROR" "Database connection failed"
fi

# Check SSL Certificate (if domain is provided)
if [ -n "$DOMAIN" ]; then
    echo -n "Checking SSL certificate... "
    if check_ssl "$DOMAIN"; then
        print_status "OK" "SSL certificate is valid"
    else
        print_status "WARN" "SSL certificate issue detected"
    fi
fi

# Check System Resources
echo -n "Checking disk space... "
if check_disk_space; then
    print_status "OK" "Disk space is sufficient"
else
    print_status "WARN" "Disk space is low"
fi

echo -n "Checking memory usage... "
if check_memory; then
    print_status "OK" "Memory usage is normal"
else
    print_status "WARN" "Memory usage is high"
fi

# Check Docker containers (if running in Docker)
if command -v docker > /dev/null 2>&1; then
    echo -n "Checking Docker containers... "
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "create-anything"; then
        print_status "OK" "Docker containers are running"
    else
        print_status "WARN" "Some Docker containers may not be running"
    fi
fi

echo ""
echo "Health check completed!"
echo "For detailed monitoring, check your monitoring dashboard or logs."
