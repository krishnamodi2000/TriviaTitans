import requests
import json

def automated_tags(request):    
# Invoke the Cloud Function
    automated_tags = "https://us-east1-serverlesssummer2023.cloudfunctions.net/python-http-function" #"YOUR_CLOUD_FUNCTION_URL"
    payload = {
        "question_text": request['question'],
        "explanation_text": request['explanation']
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(automated_tags, data=json.dumps(payload), headers=headers)
    if response.status_code == 200:
        result = response.json()
        tags = result['tags']

    return tags