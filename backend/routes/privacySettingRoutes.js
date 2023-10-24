const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  getPrivacySettings,
  updatePrivacySettings
} = require("../controllers/privacySettingController");

const router = express.Router();

//get privacy settings
router.get("/", authenticate, getPrivacySettings);

//update privacy settings
router.put("/", authenticate, updatePrivacySettings);

module.exports = router;
