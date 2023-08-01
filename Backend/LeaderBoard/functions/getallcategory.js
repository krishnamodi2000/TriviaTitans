const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        const teamLeaderboardParams = {
            TableName: 'team-leaderboard',
            ProjectionExpression: 'category',
        };

        const playerLeaderboardParams = {
            TableName: 'player-leaderboard',
            ProjectionExpression: 'category',
        };

        const teamItems = await dynamodb.scan(teamLeaderboardParams).promise();
        const playerItems = await dynamodb.scan(playerLeaderboardParams).promise();

        // Extract categories from the items and combine them into a Set to get unique categories
        const categories = new Set([
            ...teamItems.Items.map((item) => item.category),
            ...playerItems.Items.map((item) => item.category),
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ categories: [...categories] }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching categories.' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        };
    }
};
