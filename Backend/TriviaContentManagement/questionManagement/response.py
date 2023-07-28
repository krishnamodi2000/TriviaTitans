from flask import jsonify

def error_response(message, status_code):
    response = jsonify({'error': message})
    response.status_code = status_code
    return response

def success_response(message, status_code):
    response = jsonify({'message': message})
    response.status_code = status_code
    return response
