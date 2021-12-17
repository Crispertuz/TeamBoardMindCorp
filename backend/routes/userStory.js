import express from "express";
import userStory from "../controllers/userStory.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/saveUserStory", auth, admin, userStory.saveUserStory);
router.get("/listUserStory", auth, userStory.listUserStory);
router.get("/listUserStoryAdmin", auth, admin, userStory.listUserStoryAdmin);
router.put("/updateUserStoryAdmin", auth, admin, userStory.updateUserStoryAdmin);
router.put("/updateUserStory", auth, userStory.updateUserStory);
router.delete("/deleteUserStory/:_id", auth, admin, validId, userStory.deleteUserStory);

export default router;
