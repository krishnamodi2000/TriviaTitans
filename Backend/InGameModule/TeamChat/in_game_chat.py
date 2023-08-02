import json
import boto3


endpoint = 
'https://cwtl8ay572.execute-api.us-east-1.amazonaws.com/production/'
client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)

team_codes = {}

def send_msg(id, msg):
    client.post_to_connection(ConnectionId=id, 
Data=json.dumps(msg).encode('utf-8'))
    
def send_team_msg(ids, msg, from_pl):
    for id, pl_name in ids:
        print(id, pl_name, msg)
        try:
            send_msg(id, {"message": msg, "from": from_pl, "to": pl_name})
        except Exception as e:
            print("Error occured", str(e))
        
def remove_conn_id(conn_id, teams):
    team_name, (cid, pl_name) = get_team_name(conn_id, teams)
    players = teams[team_name]
    players.remove((cid, pl_name))
            
    
def get_team_name(conn_id, teams):
    for team, val in teams.items():
        for cid, pl_name in val:
            if cid == conn_id:
                return (team, (cid, pl_name))
    
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
            print(team_codes)
            team_name, (_, name) = get_team_name(conn_id, team_codes)
            remove_conn_id(conn_id, team_codes)
            send_team_msg(team_codes[team_name], f"{name} exited!", 
"System")
            print(team_codes)
        elif routeKey == 'teamCode':
            if body['teamCode'] not in team_codes:
                team_codes[body['teamCode']] = {(conn_id, body["player"])}
            else:
                team_codes[body['teamCode']].add((conn_id, 
body["player"]))
        elif routeKey == 'sendTeamMsg':
            teammates = team_codes[body['teamCode']]
            send_team_msg(teammates, body['message'], body["player"])
        elif routeKey == '$default':
            pass
        else:
            pass
        
    print(team_codes)
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

