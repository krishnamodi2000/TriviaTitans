const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const PLAYER_TABLE_NAME = 'player-leaderboard';
const TEAM_TABLE_NAME = 'team-leaderboard';

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const { category, type } = data;

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

        const params = {
            TableName: tableName,
            FilterExpression: 'category = :category',
            ExpressionAttributeValues: {
                ':category': category,
            },
            ProjectionExpression: `${key}, score, gamesplayed, win, loss, gamesplayeddate`,
            ScanIndexForward: false,
        };

        const result = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Error: ${error.message}`),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
