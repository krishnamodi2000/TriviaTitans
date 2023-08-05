const AWS = require('aws-sdk');
const uuid = require('uuid');

const TABLE_NAME = 'player-leaderboard';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);

        const itemID = uuid.v4();

        const { playerid, player_name, score, gamesplayed, win, loss, category } = data;
        const currentDatetime = new Date().toISOString();
        const item = {
            id: itemID,
            playerid: playerid,
            player_name: player_name,
            score: score,
            gamesplayed: gamesplayed,
            win: win,
            loss: loss,
            category: category,
            gamesplayeddate: currentDatetime,
        };

        const params = {
            TableName: TABLE_NAME,
            Item: item,
        };

        await dynamoDB.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify('Data added successfully to player leaderboard.'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Error: ${error.message}`),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
    }
};
