import json
import boto3
from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

logger = Logger(service="my-service", leve="INFO")

S3 = boto3.client("s3")

def hello(event, context):
    """
    A lambda function that returns an s3 presigned url.
    The nature of the url (upload or download) is deturmined by the event body.

    :param event
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
