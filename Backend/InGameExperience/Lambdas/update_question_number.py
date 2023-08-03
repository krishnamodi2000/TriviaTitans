import json
import boto3


lambda_client = boto3.client('lambda')
client = boto3.client('events')

lambda_arn = 'arn:aws:lambda:us-east-1:699271866560:function:StartGame'


def lambda_handler(event, context):
    game_id = event['game_id']
    db_name = event['db_name']
    question_number = event['question_number']
    total_questions = event['total_questions']
    rule_name = event['rule_name']
    target_id = event['target_id']
    
    next_question = int(question_number) + 1
    
    try:
        client.remove_targets(Rule=rule_name, Ids=[target_id])
        target = {
            'Id': 'StartGame',
            'Arn': lambda_arn
        }
    
        input = {
            'game_id': game_id,
            'question_number': next_question,
            'rule_name': rule_name,
            'db_name': db_name,
            'total_questions': total_questions,
            'target_id': target_id
        }
        
        target['Input'] = json.dumps(input)

        response = client.put_targets(
            Rule=rule_name,
            Targets=[target]
        )

        print(f"EventBridge rule '{rule_name}' target updated with Lambda function '{lambda_arn}'.")
    except client.exceptions.ResourceNotFoundException:
        print(f"Rule '{rule_name}' does not exist. Please check the rule name and try again.")

