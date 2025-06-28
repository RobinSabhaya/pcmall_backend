#!/bin/bash

# Download MinIO binary if not present
if [ ! -f ./minio ]; then
  echo "Downloading MinIO..."
  curl -O https://dl.min.io/server/minio/release/linux-amd64/minio
  chmod +x minio
fi

# Start MinIO in background
./minio server /data --console-address ":9001" &