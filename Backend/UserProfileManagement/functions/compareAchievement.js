exports.handler = async (req, res, database) => {
  try {
    const { userid1, userid2 } = req.body;

    if (!userid1 || !userid2) {
      return res.status(400).send('Both "userid1" and "userid2" fields are required to compare user profiles.');
    }

    // Fetch the user profiles for userid1 and userid2 from the "user-profile" collection
    const userProfileSnapshot1 = await database.collection('user-profile').where('userid', '==', userid1).get();
    const userProfileSnapshot2 = await database.collection('user-profile').where('userid', '==', userid2).get();

    // Check if both user profiles exist
    if (userProfileSnapshot1.empty || userProfileSnapshot2.empty) {
      return res.status(404).send('One or both user profiles not found.');
    }

    // Extract the user profile data from the snapshots
    const userProfileData1 = userProfileSnapshot1.docs[0].data();
    const userProfileData2 = userProfileSnapshot2.docs[0].data();

    // Compare the user profiles based on totalgamepoint
    const comparisonResult = {
      userid1: userProfileData1.userid,
      score1: userProfileData1.totalgamepoint,
      userid2: userProfileData2.userid,
      score2: userProfileData2.totalgamepoint,
    };

    // Calculate the ranks based on totalgamepoint
    const sortedProfiles = [userProfileData1, userProfileData2].sort((a, b) => b.totalgamepoint - a.totalgamepoint);
    comparisonResult.rank1 = sortedProfiles.findIndex((profile) => profile.userid === userid1) + 1;
    comparisonResult.rank2 = sortedProfiles.findIndex((profile) => profile.userid === userid2) + 1;

    return res.status(200).json(comparisonResult);
  } catch (error) {
    console.error('Error comparing user profiles:', error);
    return res.status(500).send('Something went wrong.');
  }
};
