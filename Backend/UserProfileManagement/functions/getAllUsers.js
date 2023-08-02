exports.handler = async (req, res, database) => {
  try {
    // Fetch all user profiles from the "user-profile" collection
    const userSnapshot = await database.collection('user-profile').get();

    // Check if there are any documents
    if (userSnapshot.empty) {
      return res.status(404).send('No user profiles found.');
    }

    // Create an array to store all user profiles
    const allUserProfiles = [];
    userSnapshot.forEach((doc) => {
      allUserProfiles.push(doc.data());
    });

    return res.status(200).json(allUserProfiles);
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return res.status(500).send('Something went wrong.');
  }
};
