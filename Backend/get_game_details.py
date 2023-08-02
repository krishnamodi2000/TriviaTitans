import boto3
import json

dynamoDB = boto3.client('dynamodb')
game_table_name = 'game_details'

def handler(event, context):
    game_id = json.loads(event['body'])['game_id']
    rec = dynamoDB.get_item(TableName=game_table_name, Key={'game_id': {'S': game_id}})
    game = rec['Item']
    out = {k: next(iter(v.values())) for k, v in game.items()}
    return {
    'statusCode': 200,
    'body': out
  }
