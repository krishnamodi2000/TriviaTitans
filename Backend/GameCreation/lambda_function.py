import json
import boto3
import random
import datetime

dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')

def get_questions(category, difficulty_level):
    print(category, difficulty_level)
    table = dynamodb.Table('questionsdb')
    response = table.scan(
        FilterExpression="category = :category and difficulty_level = :difficulty_level",
        ExpressionAttributeValues={":category": category, ":difficulty_level": difficulty_level}
    )
    print(response)
    return response['Items']

def calculate_max_questions(time_frame_minutes, question_time):
    time_frame_seconds = time_frame_minutes * 60
    return time_frame_seconds // question_time

def lambda_handler(event, context):
    category = event.get('category')
    difficulty_level = event.get('difficulty_level')
    time_frame_minutes = event.get('time_frame', 10)  # Default time frame is 10 minutes
    
    print(category,difficulty_level,time_frame_minutes)

    questions = get_questions(category, difficulty_level)
    
    print(questions)

    # Adjust the game length based on the selected difficulty level
    if difficulty_level == 'easy':
        question_time = 20
        min_game_length = 5
        max_game_length = 10
    elif difficulty_level == 'medium':
        question_time = 40
        min_game_length = 15
        max_game_length = 20
    else:  # 'hard'
        question_time = 60
        min_game_length = 25
        max_game_length = 30

    max_questions = calculate_max_questions(time_frame_minutes, question_time)
    selected_questions = random.sample(questions, min(len(questions), max_questions))
    print(selected_questions)

    if len(selected_questions) < 5:
        return {
            'statusCode': 400,
            'body': f'Not enough {difficulty_level} questions for category {category}'
        }

    # Create a game ID (use a timestamp for simplicity)
    game_id = str(datetime.datetime.now().timestamp())

    # Store the game details in the 'TriviaGames' table
    games_table = dynamodb.Table('gameCreationDb')
    games_table.put_item(Item={
        'game_id': game_id,
        'category': category,
        'difficulty_level': difficulty_level,
        'time_frame_minutes': time_frame_minutes,
        'questions': selected_questions
    })
    
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'game_id': game_id,
            'category': category,
            'difficulty_level': difficulty_level,
            'time_frame_minutes': time_frame_minutes,
            'questions': selected_questions
        })
    }

    return response

