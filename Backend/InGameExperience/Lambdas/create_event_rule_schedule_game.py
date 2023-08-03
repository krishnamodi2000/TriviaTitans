import boto3
import json
from datetime import datetime, timedelta

lambda_client = boto3.client('lambda')
client = boto3.client('events')

lambda_arn = 'arn:aws:lambda:us-east-1:699271866560:function:PrepareForGame'

# sets up rule 10 mins before the game starts and will trigger Prepare for game lambda
def create_event_bridge_rule(rule_name, timestamp, game_id):
    try:
        response = client.put_rule(
            Name=rule_name,
            ScheduleExpression=create_cron(timestamp),
            State='ENABLED'
        )
    except client.exceptions.ResourceAlreadyExistsException:
        print(f"Rule '{rule_name}' already exists. Updating the target...")
        response = client.put_rule(
            Name=rule_name,
            ScheduleExpression=create_cron(timestamp),
            State='ENABLED'
        )

    target = {
            'Id': 'PrepareForGame',
            'Arn': lambda_arn
    }
    
    input = {
        'game_id': game_id,
        'rule_name': rule_name,
        'timestamp': timestamp,
        'target_id': 'PrepareForGame'
    }
    
    target['Input'] = json.dumps(input)
    
    # Add the Lambda function as the target for the rule
    response = client.put_targets(
        Rule=rule_name,
        Targets=[target]
    )

    print(f"EventBridge rule '{rule_name}' with Lambda target created successfully!")
    
    
def create_cron(timestamp):
    # Parse the timestamp into a datetime object
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")

    # Subtract 10 minutes from the datetime object
    dt_before = dt - timedelta(minutes=2)

    # Extract the individual components
    minute = dt_before.minute
    hour = dt_before.hour
    day = dt_before.day
    month = dt_before.month
    year = dt_before.year

    # Construct the cron expression
    cron_expression = f"cron({minute} {hour} {day} {month} ? {year})"
    print(cron_expression)
    return cron_expression
    

def lambda_handler(event, context):
    game_id = event['game_id']
    timestamp = event['timestamp']
    rule_name = 'ScheduleGame_' + str(game_id)
    
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    
    # Create EventBridge rule
    create_event_bridge_rule(rule_name, timestamp, game_id)

    # Add permissions to the EventBridge rule to invoke the Lambda function
    lambda_client.add_permission(
        FunctionName=lambda_arn,
        StatementId='EventBridgeInvokePrepareForGame' + str(game_id) + '_' + str(dt.day),
        Action='lambda:InvokeFunction',
        Principal='events.amazonaws.com',
        SourceArn=f'arn:aws:events:us-east-1:699271866560:rule/{rule_name}'
    )

    return {
        'statusCode': 200,
        'body': 'EventBridge rule creation successful!'
    }
