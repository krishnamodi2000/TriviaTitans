import json
import boto3

events_client = boto3.client('events')
dynamo_db_client = boto3.client('dynamodb')


def lambda_handler(event, context):
    try:
        rule_name = event['rule_name']
        db_name = event['db_name']
        
        # db_response = dynamo_db_client.delete_table(TableName=db_name)
        response = events_client.disable_rule(Name=rule_name)
        print(f"EventBridge rule '{rule_name}' disabled.")
    
    except dynamodb_client.exceptions.ResourceNotFoundException as rnfe:
        print(f"Table '{db_name}' not found: {rnfe}")
    
    except events_client.exceptions.ResourceNotFoundException as rnfe:
        print(f"Rule '{rule_name}' not found: {rnfe}")

