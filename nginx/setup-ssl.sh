#!/bin/bash

# SSL Certificate Generation Script
# This script generates self-signed certificates for development
# For production, use Let's Encrypt or your CA certificates

set -e

DOMAIN=${1:-yourdomain.com}
SSL_DIR="/etc/nginx/ssl"

echo "Generating SSL certificates for $DOMAIN..."

# Create SSL directory if it doesn't exist
sudo mkdir -p $SSL_DIR

# Generate private key
sudo openssl genrsa -out $SSL_DIR/key.pem 2048

# Generate certificate signing request
sudo openssl req -new -key $SSL_DIR/key.pem -out $SSL_DIR/cert.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"

# Generate self-signed certificate (valid for 1 year)
sudo openssl x509 -req -days 365 -in $SSL_DIR/cert.csr -signkey $SSL_DIR/key.pem -out $SSL_DIR/cert.pem

# Set proper permissions
sudo chmod 600 $SSL_DIR/key.pem
sudo chmod 644 $SSL_DIR/cert.pem

# Remove CSR file
sudo rm $SSL_DIR/cert.csr

echo "SSL certificates generated successfully!"
echo "Private key: $SSL_DIR/key.pem"
echo "Certificate: $SSL_DIR/cert.pem"
echo ""
echo "For production, replace these with Let's Encrypt certificates:"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
