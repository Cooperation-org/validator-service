#!/bin/bash

# Retrieve the secrets from the environment variables
SES_FROM_EMAIL=$SES_FROM_EMAIL
SMTP_HOST=$SMTP_HOST
SMTP_PASSWORD=$SMTP_PASSWORD
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER

# Append the secrets to the .env file
echo "SES_FROM_EMAIL=$SES_FROM_EMAIL" >> .env
echo "SMTP_HOST=$SMTP_HOST" >> .env
echo "SMTP_PASSWORD=$SMTP_PASSWORD" >> .env
echo "SMTP_PORT=$SMTP_PORT" >> .env
echo "SMTP_USER=$SMTP_USER" >> .env

echo "Secrets have been stored in .env file"