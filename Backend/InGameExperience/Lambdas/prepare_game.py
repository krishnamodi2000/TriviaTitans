import boto3
import json
import time
from datetime import datetime, timedelta

lambda_client = boto3.client('lambda')
client = boto3.client('events')
dynamo_db_client = boto3.client('dynamodb')

lambda_arn = 'arn:aws:lambda:us-east-1:699271866560:function:StartGame'


# based on game id, fetches the question, answers and hints and put it into a separate db - temporary 
# sets up rule to start the game at exact time 
def update_eventbridge_rule_schedule(rule_name, timestamp, game_id, db_name, target_id, total_questions):
    try:
        client.remove_targets(Rule=rule_name, Ids=[target_id])
        
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
            'Id': 'StartGame',
            'Arn': lambda_arn
    }
    
    input = {
        'game_id': game_id,
        'db_name': db_name,
        'question_number': '1',
        'rule_name': rule_name,
        'total_questions': total_questions,
        'target_id': 'StartGame'
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

    # Extract the individual components
    minute = dt.minute
    hour = dt.hour
    day = dt.day
    month = dt.month
    year = dt.year

    # Construct the cron expression
    cron_expression = f"cron({minute} {hour} {day} {month} ? {year})"
    return cron_expression
    
    
def create_db(db_name):
    partition_key = {
        'AttributeName': 'question_number',
        'AttributeType': 'N'
    }
    
    try:
        response = dynamo_db_client.create_table(
            TableName=db_name,
            KeySchema=[{
                'AttributeName': partition_key['AttributeName'],
                'KeyType': 'HASH'
            }],
            AttributeDefinitions=[partition_key],
            BillingMode='PAY_PER_REQUEST'
        )
        
        print("Table created successfully:", response)
        
    except dynamo_db_client.exceptions.ResourceInUseException:
        print("Table already exists:", db_name)
        
    except Exception as e:
        print("An error occurred:", e)
        
        
def insert_values_in_db(db_name):
    item1 =  {
        'question_number': {'N': '2'},
        'answer': {'S': 'Asia'},
        'hint1': {'S': 'hint1'},
        'hint2': {'S': 'hint2'},
        'option1': {'S': 'Asia'},
        'option2': {'S': 'Africa'},
        'option3': {'S': 'Europe'},
        'option4': {'S': 'Antartica'},
        'question': {'S': 'What is the largest continent?'}
    }
    
    item2 = {
        "question_number": {"N": "1"},
        "answer": {"S": "Mount Everest"},
        'hint1': {'S': 'hint1'},
        'hint2': {'S': 'hint2'},
        "option1": {"S": "Mount Everest"},
        "option2": {"S": "Mount Kenya"},
        "option3": {"S": "Koyo Zom"},
        "option4": {"S": "Mauna Kea"},
        "question": {"S": "What is the name of the tallest mountain in the world?"}
     }
     
    try:
        # Insert the item into the DynamoDB table
        response1 = dynamo_db_client.put_item(
            TableName=db_name,
            Item=item1
        )
        print("Item inserted successfully:", response1)
        
        response2 = dynamo_db_client.put_item(
            TableName=db_name,
            Item=item2
        )
        
        print("Item inserted successfully:", response2)
        return "2"
        
    except Exception as e:
        print("An error occurred:", e)
        

def lambda_handler(event, context):
    game_id = event['game_id']
    timestamp = event['timestamp']
    rule_name = event['rule_name']
    target_id = event['target_id']
    
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    db_name = 'Game_' + str(game_id) + '_' + str(dt.day)

    create_db(db_name)
    time.sleep(15)
    total_questions = insert_values_in_db(db_name)
    
    # Create EventBridge rule
    update_eventbridge_rule_schedule(rule_name, timestamp, game_id, db_name, target_id, total_questions)

    # Add permissions to the EventBridge rule to invoke the Lambda function
    lambda_client.add_permission(
        FunctionName=lambda_arn,
        StatementId='EventBridgeInvokeStartGame_' + str(game_id) + '_' + str(dt.day),
        Action='lambda:InvokeFunction',
        Principal='events.amazonaws.com',
        SourceArn=f'arn:aws:events:us-east-1:699271866560:rule/{rule_name}'
    )

    return {
        'statusCode': 200,
        'body': 'EventBridge rule creation successful!'
    }
