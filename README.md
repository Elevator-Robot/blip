# Blip – An API for uploading media artifacts to s3 storage and retrieving them.

## Architecture Overview

This project deploys with the serverless framework to AWS. It uses the following AWS services:

- API Gateway (REST API)
- Lambda functions to handle AWS requests and responses
- S3 for storage

## API Endpoints

### POST /upload

Requests a signed url from the server to upload the file to s3.

#### Request body


```json
{
    "filename": "myfile.mp4",
    "contentType": "videa/mp4"
}
```

#### Response body

```json
{
    "signedUrl": "https://s3.amazonaws.com/mybucket/myfile.mp4?AWSAccessKeyId=AKIAJ..."
}
```

### GET /download

Request a signed url from the server to download the file from s3.

#### Request body

```json
{
    "signedUrl": "https://s3.amazonaws.com/mybucket/myfile.mp4?AWSAccessKeyId=AKIAJ..."
}
```

> Note: the generated signedUrl is valid for 5 minuts. After that, a new signedUrl must be requested.
