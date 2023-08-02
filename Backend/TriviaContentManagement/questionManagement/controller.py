import boto3
import uuid
import requests
import json
from automated_tags import automated_tags

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('questionsdb')

def add_question(data):

    question_id = str(uuid.uuid4())

    tags = automated_tags(data)

    question_data = {
        'question_id': question_id,
        'question': data['question'],
        'options': data['options'],
        'answer': data['answer'],
        'difficulty_level': data['difficulty_level'].lower(),
        'category' : data['category'],
        'hints':data['hints'],
        'explanation':data['explanation'],
        'tags': tags

    }
    
    table.put_item(Item=question_data)

def edit_question(question_id, data):

    tags = automated_tags(data)    
    question_data = {
        'question_id': question_id,
        'question': data['question'],
        'options': data['options'],
        'answer': data['answer'],
        'difficulty_level': data['difficulty_level'].lower(),
        'category' : data['category'],
        'hints':data['hints'],
        'explanation':data['explanation'],
        'tags': tags

    }

    table.put_item(Item=question_data)

def delete_question(data):
    question_id=data['question_id']
    difficulty=data["difficulty_level"]
    table.delete_item(Key={'question_id': question_id, 'difficulty_level': difficulty})

def get_all_questions():
    response = table.scan()
    items = response.get('Items', [])
    return items

def get_questions_by_difficulty(difficulty):
    response = table.scan(FilterExpression=boto3.dynamodb.conditions.Key('difficulty_level').eq(difficulty.lower()))
    items = response.get('Items', [])
    return items

def get_questions_by_category(category):
    response = table.scan(FilterExpression=boto3.dynamodb.conditions.Key('category').eq(category))
    items = response.get('Items', [])
    return items



