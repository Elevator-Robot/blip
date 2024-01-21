from os import environ
import json
import boto3
from aws_lambda_powertools import Logger
from aws_lambda_powertools.event_handler import (
    APIGatewayRestResolver,
    Response,
    content_types,
)
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import (
    APIGatewayProxyEvent,
)
from botocore.exceptions import ClientError

logger = Logger(service="blip", level="INFO")

S3 = boto3.client("s3")

app = APIGatewayRestResolver()


@app.post("/url")
def get_url() -> Response:
    """
    A lambda function that returns an s3 presigned url.
    The nature of the url (upload or download) is deturmined by the event body.
    """
    event_data = app.current_event.json_body
    action = event_data["action"]
    logger.info(event_data)

    params = {"Bucket": environ["BUCKET_NAME"], "Key": environ["KEY_NAME"]}

    url = None
    if action == "upload":
        url = S3.generate_presigned_url(
            ClientMethod="put_object",
            Params=params,
        )
    elif action == "download":
        url = S3.generate_presigned_url(
            ClientMethod="get_object",
            Params=params,
        )
    else:
        raise ClientError("Invalid action", "invalid action")

    if not url:
        raise ClientError(
            "There was an error generating the url",
            "This was probably caused by specifying an invalid destination",
        )

    return Response(
        status_code=200,
        content_type=content_types.APPLICATION_JSON,
        body=json.dumps({"url": url}),
    )


@logger.inject_lambda_context(log_event=True)
def lambda_handler(event: APIGatewayProxyEvent, context: LambdaContext) -> dict:
    """
    A lambda function that returns an s3 presigned url.
    """
    return app.resolve(event, context)
