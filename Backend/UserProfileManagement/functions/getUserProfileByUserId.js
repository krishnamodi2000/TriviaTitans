exports.handler = async (req, res, database) => {
  try {
    const { userid } = req.body;

    // Validate required fields (you can add more validation as per your requirements)
    if (!userid) {
      return res.status(400).send('The "userid" field is required to fetch the user profile.');
    }

    // Find the document based on userid in the "user-profile" collection
    const userSnapshot = await database.collection('user-profile').where('userid', '==', userid).get();

    // Check if the document exists
    if (userSnapshot.empty) {
      return res.status(404).send('User profile not found.');
    }

    // Return the user profile
    const userData = userSnapshot.docs[0].data();
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).send('Something went wrong.');
  }
};
