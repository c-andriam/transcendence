#!/bin/bash

echo "=== Logstash Multi-Pipeline Verification Script ==="
echo

# Function to check if service is running
check_service() {
    local service=$1
    local container_name=$2

    if podman ps --format "table {{.Names}}" | grep -q "^${container_name}$"; then
        echo "✅ $service is running"
        return 0
    else
        echo "❌ $service is not running"
        return 1
    fi
}

# Function to test syslog input
test_syslog() {
    echo "Testing syslog input on port 5140..."
    if timeout 5 bash -c "</dev/tcp/localhost/5140" 2>/dev/null; then
        echo "✅ Syslog port 5140 is listening"
        return 0
    else
        echo "❌ Syslog port 5140 is not accessible"
        return 1
    fi
}

# Function to check file permissions
check_permissions() {
    echo "Checking file permissions for Wolfi user (65532:65532)..."

    # Check if logstash container exists and get permissions
    if podman exec logstash stat -c "%u:%g" /var/log 2>/dev/null | grep -q "65532:65532"; then
        echo "✅ Log volume permissions are correct"
        return 0
    else
        echo "❌ Log volume permissions are incorrect"
        return 1
    fi
}

# Function to check Kibana data views
check_kibana_dataviews() {
    echo "Checking Kibana Data Views..."

    # Test if we can connect to Kibana API
    if curl -s -k -u "elastic:${ELASTIC_PASSWORD}" https://localhost:5601/api/data_views > /dev/null 2>&1; then
        echo "✅ Kibana API is accessible"

        # Check for syslog data view
        if curl -s -k -u "elastic:${ELASTIC_PASSWORD}" https://localhost:5601/api/data_views | grep -q "logstash-syslog"; then
            echo "✅ Syslog Data View exists"
        else
            echo "❌ Syslog Data View missing"
        fi

        # Check for file data view
        if curl -s -k -u "elastic:${ELASTIC_PASSWORD}" https://localhost:5601/api/data_views | grep -q "logstash-file"; then
            echo "✅ File Data View exists"
        else
            echo "❌ File Data View missing"
        fi
    else
        echo "❌ Cannot connect to Kibana API"
    fi
}

# Main verification
echo "1. Checking service status..."
check_service "Elasticsearch" "es01"
check_service "Kibana" "kibana"
check_service "Logstash" "logstash"
echo

echo "2. Testing network connectivity..."
test_syslog
echo

#echo "3. Verifying permissions..."
#check_permissions
#echo

echo "4. Checking Kibana auto-provisioning..."
check_kibana_dataviews
echo

echo "=== Verification Complete ==="
echo
echo "To test the pipelines:"
echo "- Send syslog messages: echo '<34>Oct 11 22:14:15 mymachine su: Test syslog message' | nc -u localhost 5140"
echo "- Check file logs: Write to /var/log/test.log and watch Logstash output"
echo "- View in Kibana: https://localhost:5601 (Data Views: Syslog Logs, File Logs)"
