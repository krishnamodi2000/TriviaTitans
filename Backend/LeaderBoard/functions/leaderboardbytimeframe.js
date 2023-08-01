const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TEAM_TABLE_NAME = 'team-leaderboard';
const PLAYER_TABLE_NAME = 'player-leaderboard';

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const { timeFrame, type } = data;

        let tableName = '';
        let key = '';

        if (type === 'player') {
            tableName = PLAYER_TABLE_NAME;
            key = 'playerid'; // Replace 'playerid' with the appropriate primary key of the player table
        } else if (type === 'team') {
            tableName = TEAM_TABLE_NAME;
            key = 'teamid'; // Replace 'teamid' with the appropriate primary key of the team table
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid type. Please provide either "player" or "team".'),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

        let filterExpression = '';
        let expressionAttributeNames = {};
        let expressionAttributeValues = {};

        switch (timeFrame) {
            case 'daily':
                filterExpression = '#gamesplayeddate >= :startDateTime';
                expressionAttributeNames['#gamesplayeddate'] = 'gamesplayeddate';
                expressionAttributeValues[':startDateTime'] = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
                break;
            case 'weekly':
                filterExpression = '#gamesplayeddate >= :startDateTime';
                expressionAttributeNames['#gamesplayeddate'] = 'gamesplayeddate';
                expressionAttributeValues[':startDateTime'] = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
                break;
            case 'monthly':
                filterExpression = '#gamesplayeddate >= :startDateTime';
                expressionAttributeNames['#gamesplayeddate'] = 'gamesplayeddate';
                expressionAttributeValues[':startDateTime'] = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
                break;
            case 'all-time':
                // No need for a filter, fetch all records
                break;
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify('Invalid timeFrame. Please provide either "daily", "weekly", "monthly", or "all-time".'),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
        }

        const params = {
            TableName: tableName,
            ProjectionExpression: `${key}, score, gamesplayed, win, loss, gamesplayeddate`,
            ScanIndexForward: false,
        };

        if (filterExpression) {
            params.FilterExpression = filterExpression;
        }

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        if (Object.keys(expressionAttributeValues).length > 0) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }

        const result = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: {
                'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'true'
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Error: ${error.message}`),
            headers: {
                'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'true'
            },
        };
    }
};
