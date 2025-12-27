# Log Transmission Chain Verification Procedure

## Prerequisites
1. Ensure all services are running with `podman compose up -d`
2. Wait for Elasticsearch health check to pass
3. Ensure log files exist at `/var/log/app/*.log` with proper permissions for UID 65532

## Verification Steps

### 1. Check Service Status
```bash
podman compose ps
```

All services should be "Up" and healthy.

### 2. Verify Filebeat Connection to Logstash
```bash
# Check Filebeat logs
podman compose logs filebeat | tail -20

# Should show successful connection to logstash:5044
```

### 3. Verify Logstash Processing
```bash
# Check Logstash logs
podman compose logs logstash | tail -20

# Should show pipeline starting and processing events
# Look for SSL connection establishment to Elasticsearch
```

### 4. Verify Elasticsearch Ingestion
```bash
# Check if index was created
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/_cat/indices | grep logstash

# Query recent documents
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/logstash-*/_search?size=5 | jq .
```

### 5. Test Log Ingestion
```bash
# Create a test log entry
echo "$(date) - Test log message from ft_transcendence" >> /var/log/app/test.log

# Wait 10 seconds, then check Elasticsearch
sleep 10
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/logstash-*/_search?q=message:test | jq .
```

### 6. Verify SSL Certificate Sharing
```bash
# Check if certificates are accessible in Logstash container
podman exec logstash ls -la /usr/share/logstash/config/certs/ca/

# Should contain ca.crt file
```

## Troubleshooting

### Filebeat Issues
- Check file permissions: `ls -la /var/log/app/`
- Ensure files are readable by UID 65532
- Verify network connectivity: `podman exec filebeat ping logstash`

### Logstash Issues
- Check SSL configuration in logs
- Verify certificate path exists
- Test manual connection: `podman exec logstash curl -v --cacert /usr/share/logstash/config/certs/ca/ca.crt https://es01:9200`

### Elasticsearch Issues
- Check cluster health: `curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/_cluster/health`
- Verify certificates exist: `podman exec es01 ls -la /usr/share/elasticsearch/config/certs/`

## Expected Results
- Filebeat successfully connects to Logstash on port 5044
- Logstash processes events and forwards to Elasticsearch via HTTPS
- Elasticsearch receives and indexes log data
- Kibana displays logs at https://localhost:5601