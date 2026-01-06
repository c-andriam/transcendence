# Logstash Multi-Pipeline Verification Procedure

## Prerequisites
1. Ensure all services are running with `podman compose up -d`
2. Wait for Elasticsearch and Kibana health checks to pass
3. Ensure log files exist at `/var/log/**/*.log` with proper permissions for UID 65532
4. Run the automated verification script: `./docker/elk/verify.sh`

## Architecture Overview
- **Syslog Pipeline**: Collects syslog messages on UDP/TCP port 5140
- **File Pipeline**: Reads log files from `/var/log/**/*.log` mounted volume
- **Security**: Wolfi non-root user (65532:65532) for all operations
- **Auto-provisioning**: Kibana Data Views created automatically

## Verification Steps

### 1. Check Service Status
```bash
podman compose ps
```

All services should be "Up" and healthy.

### 2. Verify Multi-Pipeline Configuration
```bash
# Check Logstash pipelines loaded
podman compose logs logstash | grep -i "pipeline"

# Should show both syslog-pipeline and file-pipeline starting
```

### 3. Verify Syslog Input
```bash
# Test syslog port accessibility
nc -zv localhost 5140

# Send test syslog message
echo '<34>Oct 11 22:14:15 transcendence su: Test syslog message' | nc -u localhost 5140

# Check Logstash processed it
podman compose logs logstash | grep "syslog"
```

### 4. Verify Elasticsearch Ingestion
```bash
# Check if indices were created for both pipelines
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/_cat/indices | grep logstash

# Should show: logstash-syslog-* and logstash-file-*

# Query syslog documents
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/logstash-syslog-*/_search?size=5 | jq .

# Query file documents
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/logstash-file-*/_search?size=5 | jq .
```

### 5. Test File Log Ingestion
```bash
# Create a test log entry in mounted volume
echo '{"timestamp":"'$(date -Iseconds)'","level":"info","service":"test","message":"Test log message from ft_transcendence"}' >> /var/log/test.log

# Wait 15 seconds for file input to detect change
sleep 15

# Check Logstash processed file logs
podman compose logs logstash | grep "file-pipeline"

# Query file logs in Elasticsearch
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:9200/logstash-file-*/_search?q=service:test | jq .
```

### 6. Verify Kibana Auto-Provisioning
```bash
# Check Data Views were created
curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:5601/api/data_views | jq '.data_view.saved_objects[] | {id, name, title}'

# Should show both "logstash-syslog" and "logstash-file" data views

# Access Kibana UI at https://localhost:5601
# Data Views should be available: "Syslog Logs" and "File Logs"
```

### 7. Verify Wolfi Security
```bash
# Check container runs as non-root user
podman exec logstash id

# Should show uid=65532 gid=65532

# Verify file permissions
podman exec logstash ls -la /var/log
podman exec logstash ls -la /usr/share/logstash/data

# Should be owned by 65532:65532
```

## Troubleshooting

### Syslog Pipeline Issues
- Check port accessibility: `netstat -tulpn | grep 5140`
- Test UDP connectivity: `echo "test" | nc -u -w1 localhost 5140`
- Verify Logstash syslog input: `podman compose logs logstash | grep syslog`

### File Pipeline Issues
- Check file permissions: `ls -la /var/log/`
- Ensure files are readable by UID 65532: `chown -R 65532:65532 /var/log/`
- Verify sincedb path: `podman exec logstash ls -la /usr/share/logstash/data/`
- Check file input logs: `podman compose logs logstash | grep file-pipeline`

### Wolfi Security Issues
- Verify user permissions: `podman exec logstash whoami` (should be 65532)
- Check volume ownership: `podman exec logstash stat -c "%u:%g" /var/log`
- Fix permissions if needed: `podman exec logstash chown -R 65532:65532 /var/log`

### Kibana Auto-Provisioning Issues
- Check Kibana health: `curl -k https://localhost:5601/api/status`
- Verify API credentials: test with `curl -u elastic:${ELASTIC_PASSWORD} -k https://localhost:5601/api/data_views`
- Check init script logs: `podman compose logs logstash | grep -A 10 "Creating Data Views"`

### General Issues
- Check SSL configuration in logs
- Verify certificate path exists
- Test manual connection: `podman exec logstash curl -v --cacert /usr/share/logstash/config/certs/ca/ca.crt https://es01:9200`

## Expected Results
- Syslog pipeline listens on UDP/TCP port 5140
- File pipeline reads from `/var/log/**/*.log` mounted volume
- Both pipelines forward to separate Elasticsearch indices via HTTPS
- Kibana auto-creates Data Views for both log types
- All operations run under Wolfi non-root user (65532:65532)
- Logs accessible in Kibana at https://localhost:5601