const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors')({origin: true});

// import all modules
const addUserProfile = require('./addUserProfile');
const updateUserProfile = require('./updateUserProfile');
const compareAchievement = require('./compareAchievement');
const getAllUsers = require('./getAllUsers');
const getUserProfileByUserId = require('./getUserProfileByUserId');
const updateUserStatistics = require('./updateUserStatistics');

exports.addUserProfile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        addUserProfile.handler(req, res, db);
    });
});

exports.updateUserProfile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        updateUserProfile.handler(req, res, db);
    });
});

exports.compareAchievement = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        compareAchievement.handler(req, res, db);
    });
});

exports.getAllUsers = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        getAllUsers.handler(req, res, db);
    });
});

exports.getUserProfileByUserId = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        getUserProfileByUserId.handler(req, res, db);
    });
});

exports.updateUserStatistics = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        updateUserStatistics.handler(req, res, db);
    });
});
