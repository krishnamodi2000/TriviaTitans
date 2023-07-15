import boto3
import json


def lambda_handler(event, context):
    # Connect to DynamoDB
    dynamodb = boto3.resource('dynamodb')

    # Choose the table you want to insert data into
    table = dynamodb.Table('TriviaUserLoginInformation')
    print(event)

    # Retrieve data from the event
    body = str(event['body']).replace('\n', '')
    json_body = json.loads(body)


    print(json_body)

    try:
        # Perform the DynamoDB put operation
        table.put_item(Item=json_body)
        response = {
            'statusCode': 200,
            'body': 'Data inserted successfully!'
        }

        return response

    except Exception as e:
        response = {
            'statusCode': 500,
            'body': f'Error inserting data: {str(e)}'
        }

        return response