#!/bin/bash
for i in {1..50}; do
  curl -s -o /dev/null -w "%{http_code}\n" --max-time 2 http://localhost:8080/
done
