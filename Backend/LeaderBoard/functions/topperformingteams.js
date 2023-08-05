const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'team-leaderboard';
const DEFAULT_TOP_TEAMS = 10;

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const numberOfTopTeams = data.numberOfTopTeams || DEFAULT_TOP_TEAMS;

        const scanParams = {
            TableName: TABLE_NAME,
            ProjectionExpression: 'teamid, team_name, score, gamesplayed, win, loss, gamesplayeddate',
        };

        const result = await dynamoDB.scan(scanParams).promise();

        const teamStatsMap = new Map();
        result.Items.forEach((team) => {
            const { teamid, team_name, score, win, loss } = team;
            if (teamStatsMap.has(teamid)) {
                const existingStats = teamStatsMap.get(teamid);
                teamStatsMap.set(teamid, {
                    score: existingStats.score + score,
                    win: existingStats.win + win,
                    loss: existingStats.loss + loss,
                    team_name: team_name
                });
            } else {
                teamStatsMap.set(teamid, {
                    score: score,
                    win: win,
                    loss: loss,
                    team_name: team_name
                });
            }
        });

        // Sort the teams by total score in descending order
        const sortedTeams = Array.from(teamStatsMap).sort((a, b) => b[1].score - a[1].score);

        // Assign ranks based on the position in the sorted list
        const teamsWithRank = sortedTeams.map((entry, index) => ({
            teamid: entry[0],
            score: entry[1].score,
            win: entry[1].win,
            loss: entry[1].loss,
            rank: index + 1,
            team_name: entry[1].team_name
        }));

        // Slice the top number of teams based on the requested count
        const topTeams = teamsWithRank.slice(0, numberOfTopTeams);

        return {
            statusCode: 200,
            body: JSON.stringify(topTeams),
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
