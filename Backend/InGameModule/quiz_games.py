import json
import boto3


endpoint = 'https://nquds1e5se.execute-api.us-east-1.amazonaws.com/production/'
client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)

dynamodb = boto3.client('dynamodb')


games = {}

def delete_connection_from_table(connection_to_delete):
    dynamodb.update_item(
        TableName='game_connections',
        Key={'game_id': {'S': games[connection_to_delete]}},
        UpdateExpression='DELETE connections :connection_to_delete',
        ExpressionAttributeValues={':connection_to_delete': {'SS': 
[connection_to_delete]}},
    )
    games.pop(connection_to_delete)
    print("Item deleted successfully!")


def lambda_handler(event, context):
    print(event)
    
    if 'requestContext' in event:
        conn_id = event['requestContext']['connectionId']
        routeKey = event['requestContext']['routeKey']
        
        if 'body' in event:
            body = json.loads(event['body'])
        
        if routeKey == '$connect':
            pass
        elif routeKey == '$disconnect':
            print(conn_id, "to delete")
            delete_connection_from_table(conn_id)
        elif routeKey == 'joinGame':
            game_id = body['game_id']
            player = body["player"]
            team_id = body["team_id"]
            games[conn_id] = game_id
            
            item = {
                "game_id": {"S": game_id},
                "connections": {"SS": [conn_id]}
            }
            try:
                # Use a conditional expression to put the new item only if the game_id 
does not exist
                dynamodb.put_item(
                    TableName='game_connections',
                    Item=item,
                    ConditionExpression='attribute_not_exists(game_id)',
                )
                print("New item inserted successfully!")

            except dynamodb.exceptions.ConditionalCheckFailedException:
                # If the condition fails, it means the game_id already exists, so update 
the item instead
                dynamodb.update_item(
                    TableName='game_connections',
                    Key={'game_id': {'S': game_id}},
                    UpdateExpression='ADD connections :new_connection',
                    ExpressionAttributeValues={
                        ':new_connection': {'SS': [conn_id]},
                    },
                )
                print("Connection appended to existing item successfully!")
        elif routeKey == 'getGameQues':
            game_id = body['game_id']
            # Get all the questions from game_id
        elif routeKey == 'sendQues':
            # push question to the game
            game_id = body['game_id']
        elif routeKey == '$default':
            pass
        else:
            pass
        
    # print(team_codes)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

