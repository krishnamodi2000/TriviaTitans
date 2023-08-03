import boto3
import json

lambda_client = boto3.client('lambda')
client = boto3.client('events')

lambda_arn = 'arn:aws:lambda:us-east-1:699271866560:function:StartGame'


# sets up rule to fetch question and push it to UI every 1 minute
def update_eventbridge_rule_schedule(rule_name, game_id,  db_name, total_questions):
    try:
        response = client.put_rule(
            Name=rule_name,
            ScheduleExpression='rate(1 minute)',
            State='ENABLED'
        )
    except client.exceptions.ResourceAlreadyExistsException:
        print(f"Rule '{rule_name}' already exists. Updating the target...")
        response = client.put_rule(
            Name=rule_name,
            ScheduleExpression='rate(1 minute)',
            State='ENABLED'
        )


    print(f"EventBridge rule '{rule_name}' with Lambda target created successfully!")

def lambda_handler(event, context):
    game_id = event['game_id']
    db_name = event['db_name']
    total_questions = event['total_questions']
    rule_name = event['rule_name']
    
    # Create EventBridge rule
    update_eventbridge_rule_schedule(rule_name, game_id, db_name, total_questions)

    return event
