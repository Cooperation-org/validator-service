#!/bin/bash

if [ -z "$SES_FROM_EMAIL" ]; then
  echo "SES_FROM_EMAIL is not set"
else
  echo "SES_FROM_EMAIL=$SES_FROM_EMAIL" >> .env
fi

if [ -z "$SMTP_HOST" ]; then
  echo "SMTP_HOST is not set"
else
  echo "SMTP_HOST=$SMTP_HOST" >> .env
fi

if [ -z "$SMTP_PASSWORD" ]; then
  echo "SMTP_PASSWORD is not set"
else
  echo "SMTP_PASSWORD=$SMTP_PASSWORD" >> .env
fi

if [ -z "$SMTP_PORT" ]; then
  echo "SMTP_PORT is not set"
else
  echo "SMTP_PORT=$SMTP_PORT" >> .env
fi

if [ -z "$SMTP_USER" ]; then
  echo "SMTP_USER is not set"
else
  echo "SMTP_USER=$SMTP_USER" >> .env
fi

echo "Secrets have been stored in .env file"
