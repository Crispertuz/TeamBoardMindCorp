import mongoose from "mongoose";

const userStorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "users" },
  name: String,
  userStoryStatus: String,
  description: {type: String, default: undefined},
  startDate: { type: Date, default: Date.now },
  dueDate: { type: Date, default: Date.now },
  details: String,
  bugs: {type: String, default: " "}
});

const userStory = mongoose.model("userStories", userStorySchema);
export default userStory;