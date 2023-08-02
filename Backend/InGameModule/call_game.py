import json
import boto3

endpoint = 'https://nquds1e5se.execute-api.us-east-1.amazonaws.com/production/'
client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)

dynamodb = boto3.client('dynamodb')

def send_msg(id, msg):
    client.post_to_connection(ConnectionId=id, Data=json.dumps(msg).encode('utf-8'))

def lambda_handler(event, context):
    
    response = dynamodb.get_item(
        TableName='game_connections',
        Key={'game_id': {'S': "f5643332-16df-11ee-be56-0242ac120002"}},
    )
    if 'Item' in response:
        item = response['Item']
        print(item)
        connections = item['connections']['SS']
        for conn in connections:
            send_msg(conn, {'question': { 'id': 1, 'text': 'What is the capital of 
France?', 'answer': 'Paris' }, 'isGameStarted': True})
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

