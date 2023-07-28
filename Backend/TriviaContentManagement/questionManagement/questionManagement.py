from flask import Flask, request
from controller import add_question, edit_question, delete_question, get_all_questions, get_questions_by_category, get_questions_by_difficulty
from response import error_response, success_response
from validation import validate_question_data


app = Flask(__name__)

@app.route('/questions/add', methods=['POST'])
def add_question_route():
    try:
        data = request.get_json()

        response_message, status_code = validate_question_data(data)
        if response_message:
            return error_response(response_message, status_code)

        add_question(data)

        return success_response('Question added successfully.', 201)
    except Exception as e:
        return error_response(str(e), 500)

@app.route('/questions/<question_id>', methods=['PUT'])
def edit_question_route(question_id):
    try:
        data = request.get_json()

        response_message, status_code = validate_question_data(data)
        if response_message:
            return error_response(response_message, status_code)

        edit_question(question_id, data)

        return success_response('Question updated successfully.', 200)
    except Exception as e:
        return error_response(str(e), 500)

@app.route('/questions/delete', methods=['DELETE'])
def delete_question_route():
    data=request.get_json()
    
    try:
        delete_question(data)

        return success_response('Question deleted successfully.', 200)
    except Exception as e:
        return error_response(str(e), 500)
    

@app.route('/questions', methods=['GET'])
def get_all_questions_route():
    try:
        questions = get_all_questions()

        return success_response(questions, 200)
    except Exception as e:
        return error_response(str(e), 500)

@app.route('/questions/difficulty/<difficulty>', methods=['GET'])
def get_questions_by_difficulty_route(difficulty):
    try:
        questions = get_questions_by_difficulty(difficulty)

        return success_response(questions, 200)
    except Exception as e:
        return error_response(str(e), 500)

@app.route('/questions/category/<category>', methods=['GET'])
def get_questions_by_category_route(category):
    try:
        questions = get_questions_by_category(category)

        return success_response(questions, 200)
    except Exception as e:
        return error_response(str(e), 500)

if __name__ == '__main__':
    app.run(debug=True)
