import json
import os
import time
import operator

import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-admin.json")
firebase_admin.initialize_app(cred)

app_client_id = os.environ['client_id']


def verify_token(token):
    response = auth.verify_id_token(token)
    return response
    

def generate_auth_policy(principal_id, resource, effect):
    auth_response = {"principalId": principal_id}
    if effect and resource:
        policy_document = {"Version": '2012-10-17', "Statement": []}
        statement_one = {"Action": 'execute-api:Invoke', "Effect": effect, "Resource": resource}
        policy_document["Statement"].append(statement_one)
        auth_response["policyDocument"] = policy_document
    return auth_response


def lambda_handler(event, context):
    response = {}
    try:
        print(event)
        resource = event['methodArn']
        verification_result = verify_token(event["token"])
        if verification_result:
            print("policy is allowed")

            effect = 'Deny'
            if 'isUser' not in verification_result:
                effect = 'Allow'
            else:
                if operator.contains(resource, '/user/'):
                    effect = 'Allow'
                    print('User is allowed!')

            response = generate_auth_policy(verification_result['sub'], resource, effect)
            new_context = {
                'userId': verification_result['user_id'],
                'email': verification_result['email']
            }
            response['context'] = new_context
        else:
            print("policy is not allowed")
            response = generate_auth_policy(None, resource, 'Deny')

    except Exception as e:
        response = generate_auth_policy(None, resource, 'Deny')
        print(format(e))

    finally:
        print(response)
        return response

