from flask import Flask, request, jsonify
import boto3
import json

app = Flask(__name__)

# Replace 'your_lambda_function_name' with the actual name of your Lambda function
lambda_client = boto3.client('lambda', region_name='us-east-1')

@app.route('/create_game', methods=['POST'])
def create_game():
    data = request.get_json()
    category = data.get('category')
    difficulty_level = data.get('difficulty_level')
    time_frame_minutes = data.get('time_frame', 10)

    # Validate input data here if needed

    # Prepare the input payload for the Lambda function
    lambda_payload = {
        'category': category,
        'difficulty_level': difficulty_level,
        'time_frame': time_frame_minutes
    }

    try:
        # Invoke the Lambda function synchronously (RequestResponse)
        response = lambda_client.invoke(
            FunctionName='GameCreation',
            InvocationType='RequestResponse',
            Payload=json.dumps(lambda_payload)
        )

        # Get the response payload from the Lambda function
        lambda_response_payload = json.loads(response['Payload'].read())

        # Check if there was an error in the Lambda function
        if 'errorMessage' in lambda_response_payload:
            return jsonify({'error': lambda_response_payload['errorMessage']}), 500

        # Return the game details from the Lambda response
        return jsonify(lambda_response_payload), 200

    except Exception as e:
        # Return an error message if the Lambda function call fails
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
