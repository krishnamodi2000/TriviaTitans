const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'player-leaderboard';
const DEFAULT_TOP_PLAYERS = 10;

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const numberOfTopPlayers = data.numberOfTopPlayers || DEFAULT_TOP_PLAYERS;

        const scanParams = {
            TableName: TABLE_NAME,
            ProjectionExpression: 'playerid, player_name, score, gamesplayed, win, loss, gamesplayeddate',
        };

        const result = await dynamoDB.scan(scanParams).promise();

        const playerStatsMap = new Map();
        result.Items.forEach((player) => {
            const { playerid, player_name, score, win, loss } = player;
            if (playerStatsMap.has(playerid)) {
                const existingStats = playerStatsMap.get(playerid);
                playerStatsMap.set(playerid, {
                    score: existingStats.score + score,
                    win: existingStats.win + win,
                    loss: existingStats.loss + loss,
                    player_name: player_name
                });
            } else {
                playerStatsMap.set(playerid, {
                    score: score,
                    win: win,
                    loss: loss,
                    player_name: player_name
                });
            }
        });

        // Sort the players by total score in descending order
        const sortedPlayers = Array.from(playerStatsMap).sort((a, b) => b[1].score - a[1].score);

        // Assign ranks based on the position in the sorted list
        const playersWithRank = sortedPlayers.map((entry, index) => ({
            playerid: entry[0],
            score: entry[1].score,
            win: entry[1].win,
            loss: entry[1].loss,
            rank: index + 1,
            player_name: entry[1].player_name
        }));

        // Slice the top number of players based on the requested count
        const topPlayers = playersWithRank.slice(0, numberOfTopPlayers);

        return {
            statusCode: 200,
            body: JSON.stringify(topPlayers),
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
