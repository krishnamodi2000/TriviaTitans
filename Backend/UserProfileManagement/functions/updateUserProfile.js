exports.handler = async (req, res, database) => {
  try {
    // Get the request data (userid, and other fields to be updated)
    const { userid, username, contactnumber, userprofileurl, totalgamepoint, winlossratio, totalgamesplayed } = req.body;

    // Validate required fields (you can add more validation as per your requirements)
    if (!userid) {
      return res.status(400).send('The "userid" field is required for updating the user profile.');
    }

    // Prepare the data to be updated
    const dataToUpdate = {
      username,
      contactnumber,
      userprofileurl,
      totalgamepoint,
      winlossratio,
      totalgamesplayed,
    };

    // Find the document based on userid in the "user-profile" collection
    const userSnapshot = await database.collection('user-profile').where('userid', '==', userid).get();

    // Check if the document exists
    if (userSnapshot.empty) {
      return res.status(404).send('User profile not found.');
    }

    // Update the first document found (Assuming userid is unique)
    const docRef = userSnapshot.docs[0].ref;
    await docRef.update(dataToUpdate);

    return res.status(200).send('User profile updated successfully.');
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).send('Something went wrong.');
  }
};
