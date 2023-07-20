import boto3

dynamodb = boto3.client('dynamodb')


def validate(slots):
    if not slots['teamName']:
        return {
            'isValid': False,
            'violatedSlot': 'teamName'
        }

    return {'isValid': True}


def lambda_handler(event, context):
    print(event)
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    try:
        print(event['invocationSource'])
        print(slots)
        validation_result = validate(event['sessionState']['intent']['slots'])

        if event['invocationSource'] == 'DialogCodeHook':
            if not validation_result['isValid']:
                response = {
                    "sessionState": {
                        "dialogAction": {
                            'slotToElicit': validation_result['violatedSlot'],
                            "type": "ElicitSlot"
                        },
                        "intent": {
                            'name': intent,
                            'slots': slots

                        }
                    }
                }
                return response

            else:
                print('here')
                response = {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Delegate"
                        },
                        "intent": {
                            'name': intent,
                            'slots': slots

                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": 'Your team score is 10'
                        }
                    ]
                }
                return response

        if event['invocationSource'] == 'FulfillmentCodeHook':
            team_name = slots['teamName']['value']['originalValue']
            print(team_name)
            resp = dynamodb.get_item(TableName='TeamScore', Key={'teamName': {'S': team_name.lower()}})

            if 'Item' in resp:
                item = resp['Item']

                score = item['score']['N']
                message = 'The requested team score is ' + str(score) + '. Thank You!'

            else:
                message = 'The requested team score not found. The team does not exist. Please try again!'

            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots,
                        'state': 'Fulfilled'
                    }
            
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": message
                    }
                ]
            }
            
            return response

    except Exception as e:
        print(e)
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    'name': intent,
                    'slots': slots,
                    'state': 'Failed'
        
                }
        
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "Something went wrong. Please try again!"
                }
            ]
        }
        return response

