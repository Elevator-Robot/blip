import json
import boto3
from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

logger = Logger(service="my-service", leve="INFO")

S3 = boto3.client("s3")


def get_url(event, context):
    """
    A lambda function that returns an s3 presigned url.
    The nature of the url (upload or download) is deturmined by the event body.
    """
    event = json.loads(event["body"])

    params = {
        "Bucket": "blahBucket",
        "key": "blahKey",
    }

    if event["action"] == "upload":
        S3.generate_presigned_url(
            ClientMethod="put_opject",
            Params=params,
        )
    elif event["action"] == "download":
        S3.generate_presigned_url(
            ClientMethod="get_object",
            Params=params,
        )
    else:
        raise ClientError("Invalid action", "invalid action")


def lambda_handler(event, context):
    try:
        return get_url(event, context)
    except ClientError as e:
        logger.exception(e)
        raise e
