import boto3
from boto3.dynamodb.types import TypeDeserializer
import json

def lambda_handler(event, context):
    # Connect to DynamoDB
    dynamodb = boto3.resource('dynamodb')

    # Choose the table you want to fetch data from
    table = dynamodb.Table('TriviaUserLoginInformation')

    # Retrieve email from the event
    body = str(event['body']).replace('\n', '')
    json_body = json.loads(body)
    print(json_body)

    try:
        # Perform the DynamoDB query operation
        response = table.get_item(
            Key={
                'userId': json_body['userId']
            }
        )

        # Check if the item was found
        if 'Item' in response:
            item = response['Item']
            print(item)

            questions = item['questions']
            db_answer = questions[json_body['question']]
            group = item['group']

            print(group)
            if db_answer.lower() == json_body['answer'].lower():
                # Return the parsed item data as the response
                print('Response sent 200')
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': 'content-type, token',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST',
                        'Access-Control-Allow-Origin': '*', 
                        'Allow': 'OPTIONS,POST'
                    },
                    'body': json.dumps({'group': group})
                }

            else:
                print('Response sent 400')
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Headers': 'content-type, token',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST',
                        'Access-Control-Allow-Origin': '*', 
                        'Allow': 'OPTIONS,POST'
                    },
                    'body': 'Wrong answer'
                }

        else:
            # Return a not found response if item not found
            print('Response sent 500')
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Headers': 'content-type, token',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST',
                    'Access-Control-Allow-Origin': '*', 
                    'Allow': 'OPTIONS,POST'
                },
                'body': 'Item not found in the table'
            }

    except Exception as e:
        # Return an error response if any exception occurs
        print(str(e))
        print('Response sent last 500')
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'content-type, token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Origin': '*',  
                'Allow': 'OPTIONS,POST'
            },
            'body': json.dumps(f'Error retrieving data: {str(e)}')
        }
