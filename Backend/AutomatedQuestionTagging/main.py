from google.cloud import language
import functions_framework
from flask import jsonify
import re

print("Reached here")

@functions_framework.http
def automated_tagging(request):
    request_json = request.get_json(silent=True)
    question_text = request_json['question_text']
    explanation_text = request_json ['explanation_text']
    document= question_text+explanation_text

    response = classify_text(document)
    categories = response.categories
    category_names = extract_tags(categories)
    print(category_names)

    return jsonify({'tags': category_names})


def classify_text(text: str) -> language.ClassifyTextResponse:
    client = language.LanguageServiceClient()
    document = language.Document(
        content=text,
        type_=language.Document.Type.PLAIN_TEXT,
    )
    return client.classify_text(document=document)

def extract_tags(categories):
    category_names = []
    for category in categories:
        category_name = category.name
        matches = re.findall(r'/(?P<tag>[^/]+)', category_name)
        category_names.extend(matches)
    return category_names
    
