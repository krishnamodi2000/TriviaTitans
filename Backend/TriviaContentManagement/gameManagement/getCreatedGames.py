from flask import Flask, jsonify
import boto3

app = Flask(__name__)

# Replace 'your_dynamodb_table_name' with the actual name of your DynamoDB table
dynamodb = boto3.resource('dynamodb')
games_table = dynamodb.Table('gameCreationDb')

@app.route('/games', methods=['GET'])
def get_games():
    try:
        # Scan the DynamoDB table to get all games
        response = games_table.scan()
        games = response['Items']

        # Continue scanning if the result is paginated
        while 'LastEvaluatedKey' in response:
            response = games_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            games.extend(response['Items'])

        # Format the response to include only relevant game details
        formatted_games = []
        for game in games:
            formatted_game = {
                'game_id': game['game_id'],
                'category': game['category'],
                'difficulty_level': game['difficulty_level'],
                'questions': game['questions'],
                'time_frame_minutes': int(game['time_frame_minutes'])
            }
            formatted_games.append(formatted_game)

        # Return the list of games as JSON response
        return jsonify(formatted_games), 200

    except Exception as e:
        # Return an error message if there's an issue with DynamoDB
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
