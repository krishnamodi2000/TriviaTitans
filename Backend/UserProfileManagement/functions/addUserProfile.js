exports.handler = async (req, res, database) => {
  try {
    const { userid, username, contactnumber, userprofileurl, totalgamepoint, winlossratio, totalgamesplayed } = req.body;

    // Validate required fields (you can add more validation as per your requirements)
    if (!userid || !username || !contactnumber || !userprofileurl || !totalgamepoint || !winlossratio || !totalgamesplayed) {
      return res.status(400).send('All fields are required.');
    }

    // Create a new document in the "user-profile" collection
    await database.collection('user-profile').doc().set({
      userid,
      username,
      contactnumber,
      userprofileurl,
      totalgamepoint,
      winlossratio,
      totalgamesplayed,
    });

    return res.status(201).send('User profile created successfully.');
  } catch (error) {
    console.error('Error creating user profile:', error);
    return res.status(500).send('Something went wrong.');
  }
};
