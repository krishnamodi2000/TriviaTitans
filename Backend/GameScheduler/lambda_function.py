import json
import boto3
import datetime

dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')
sns=boto3.client('sns')

def get_game_details(game_id):
    table = dynamodb.Table('gameCreationDb')
    response = table.get_item(Key={'game_id': game_id})
    return response.get('Item')

def schedule_game(game_id, scheduled_time):
    game_details = get_game_details(game_id)
    if not game_details:
        print(f"Game with ID {game_id} not found.")
        return

    category = game_details['category']
    difficulty_level = game_details['difficulty_level']
    time_frame_minutes = int( game_details['time_frame_minutes'])
    questions = game_details['questions']

  # Make current_time offset-aware with UTC timezone
    current_time = datetime.datetime.now(datetime.timezone.utc)

    # Make scheduled_time offset-aware with UTC timezone (assuming scheduled_time is in UTC)
    scheduled_time = scheduled_time.replace(tzinfo=datetime.timezone.utc)

    # Calculate the time remaining until the scheduled time
    time_remaining = (scheduled_time - current_time).total_seconds()


    if time_remaining <= 0:
        print("The specified time is in the past. Cannot schedule the game.")
        return
    
    delay_seconds = int(time_remaining) if time_remaining <= 900 else 0


    # Send the game details to the SNS Topic
    topics = sns.list_topics()
    topic_Arn = next((topic['TopicArn'] for topic in topics['Topics'] if 'GameScheduled' in topic['TopicArn']), None)
    
    message =  {
        'game_id': game_id,
        'category': category,
        'difficulty_level': difficulty_level,
        'time_frame_minutes': time_frame_minutes,
        'scheduled_time': str(scheduled_time),
        'questions': questions,
        'message': 'Game has been scheduled and questions are ready!'
    }
   
   
   
    response = sns.publish( TopicArn=topic_Arn, Message=json.dumps(message))
    print("Message published to SNS topic successfully!", message)
    print("Message ID:", response['MessageId'])



def lambda_handler(event, context):
    game_id = event.get('game_id')  
    scheduled_time_str = event.get('scheduled_time') 
    
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    scheduled_time = datetime.datetime.strptime(scheduled_time_str, date_format)


    schedule_game(game_id, scheduled_time)
