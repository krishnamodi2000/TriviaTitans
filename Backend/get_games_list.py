import json
import boto3

dynamoDB = boto3.client('dynamodb')
game_table_name = 'game_details'

def lambda_handler(event, context):
    try:
        records = dynamoDB.scan(TableName=game_table_name)
        games = records['Items']
        out = [{k: next(iter(v.values())) for k, v in r.items()}  for r in games]
    except:
        raise e
    
    return {
        'statusCode': 200,
        'body': out
    }

