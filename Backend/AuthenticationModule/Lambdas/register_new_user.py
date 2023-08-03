import boto3
import json
import firebase_admin
import os
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-admin.json")
firebase_admin.initialize_app(cred)
# Connect to DynamoDB
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
topic_arn = os.environ['topic_arn']
dynamo_table_name = os.environ['dynamo_table_name']


def lambda_handler(event, context):
    # Choose the table you want to insert data into
    table = dynamodb.Table(dynamo_table_name)
    print(event)
    
    # Retrieve data from the event
    body = str(event['body']).replace('\n', '')
    json_body = json.loads(body)
    json_body['group'] = 'user'
    
    authorizer = event['requestContext']['authorizer']
    email_address = authorizer['email']
    json_body['email'] = email_address
    userId = authorizer['userId']
    json_body['userId'] = userId

    print(json_body)

    try:
        auth.set_custom_user_claims(userId, {'isUser': True})
        
        response = sns.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=email_address
        )

        # Perform the DynamoDB put operation
        table.put_item(Item=json_body)
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'content-type, token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Origin': '*',
                'Allow': 'OPTIONS,POST'
            },
            'body': 'Data inserted successfully!'
        }

        return response

    except Exception as e:
        response = {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'content-type, token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Origin': '*',
                'Allow': 'OPTIONS,POST'
            },
            'body': f'Error inserting data: {str(e)}'
        }

        return response
