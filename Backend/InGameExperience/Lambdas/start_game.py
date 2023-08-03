import json
import boto3
import os

client = boto3.client('stepfunctions')
dynamo_db_client = boto3.client('dynamodb')
step_function_arn = os.environ['step_function_arn']


# query db for the question based on game id and question number
def lambda_handler(event, context):
    db = event['db_name']
    game_id = event['game_id']
    question_number = event['question_number']
    rule_name = event['rule_name']
    total_questions = event['total_questions']
    target_id = event['target_id']
    
    sf_input = {
        'rule_name': rule_name,
        'game_id': game_id,
        'db_name': db,
        'total_questions': str(total_questions),
        'question_number': str(question_number),
        'target_id': target_id
    }
    
    response = dynamo_db_client.get_item(TableName=db, Key={'question_number': {'N': str(question_number)}})
    if 'Item' in response:
        # Entity exists, update the value by adding the new value
        item = response['Item']
        
        sf_input['question'] = item['question']['S']
        sf_input['option1'] = item['option1']['S']
        sf_input['option2'] = item['option2']['S']
        sf_input['option3'] = item['option3']['S']
        sf_input['option4'] = item['option4']['S']
        sf_input['answer'] = item['answer']['S']
        
    if question_number != "1":
        last_question_number = int(question_number) - 1
        last_ques_response = dynamo_db_client.get_item(TableName=db, Key={'question_number': {'N': str(last_question_number)}})
        if 'Item' in last_ques_response:
            # Entity exists, update the value by adding the new value
            last_ques_item = last_ques_response['Item']
            
            sf_input['previous_answer'] = last_ques_item['answer']['S']
        
    print(sf_input)

    sf_response = client.start_execution(
        stateMachineArn=step_function_arn,
        input=json.dumps(sf_input)
    )

