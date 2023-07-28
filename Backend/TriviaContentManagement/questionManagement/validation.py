DIFFICULTY_LEVELS = ['easy', 'medium', 'hard']

def validate_question_data(data):
    required_fields = ['question', 'options', 'answer', 'difficulty_level']
    if not all(field in data for field in required_fields):
        return 'Missing required fields.', 400
    
    options = data['options']
    if len(options) < 2:
        return 'At least 2 options are required.', 400

    answer = data['answer']
    if answer not in options:
        return 'The correct answer must be one of the provided options.', 400

    difficulty_level = data['difficulty_level']
    if difficulty_level.lower() not in DIFFICULTY_LEVELS:
        return "The difficulty level must be 'easy,' 'medium,' or 'hard'.", 400

    return None, 200
