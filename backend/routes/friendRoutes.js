const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { sendFriendRequest, acceptFriendRequest, removeFriend, blockUser, listFriends, getFriendDetails } = require('../controllers/friendController');

router.post('/send-friend-request', authenticate, sendFriendRequest);
router.post('/accept-friend-request/:friend_id', authenticate, acceptFriendRequest);
router.delete('/remove-friend/:friend_id', authenticate, removeFriend);
router.post('/block-user/:friend_id', authenticate, blockUser);
router.get('/list-friends', authenticate, listFriends);
router.get('/get-friend-details/:friend_id', authenticate, getFriendDetails);

module.exports = router;
