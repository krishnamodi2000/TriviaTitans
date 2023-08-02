from flask import Flask, request, jsonify
import boto3
import json

app = Flask(__name__)

# Replace 'your_lambda_function_name' with the actual name of your game scheduler Lambda function
lambda_client = boto3.client('lambda', region_name='us-east-1')

@app.route('/schedule_game', methods=['POST'])
def schedule_game():
    data = request.get_json()
    game_id = data.get('game_id')
    scheduled_time = data.get('scheduled_time')

    # Prepare the input payload for the game scheduler Lambda function
    lambda_payload = {
        'game_id': game_id,
        'scheduled_time': scheduled_time
    }

    try:
        # Invoke the game scheduler Lambda function
        response = lambda_client.invoke(
            FunctionName='GameScheduler',
            InvocationType='RequestResponse',  # Use 'RequestResponse' to invoke synchronously
            Payload=json.dumps(lambda_payload)
        )

        # Parse the response from the Lambda function
        lambda_response_payload = json.loads(response['Payload'].read())

        # Check if there was an error in the Lambda function
        if 'error' in lambda_response_payload:
            return jsonify({'error': lambda_response_payload['error']}), 500

        # Return the SNS message as a response
        return jsonify(lambda_response_payload), 200

    except Exception as e:
        # Return an error message if the Lambda function call fails
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
