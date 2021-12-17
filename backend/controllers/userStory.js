import userStory from "../models/userStory.js";
import role from "../models/role.js";
import user from "../models/user.js";


const saveUserStory = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.userId ||
    !req.body.userStoryStatus ||
    !req.body.details
  )
    return res.status(400).send({ message: "Incomplete data" });

  try {
    const userExists = await user.findById({ _id: req.body.userId });
    if (!userExists)
      return res.status(400).send({ message: "User not exists" });
  } catch (e) {
    console.log("error " + e);
  }

  const userStorySchema = new userStory({
    userId: req.body.userId,
    name: req.body.name,
    userStoryStatus: "to-do",
    details: req.body.details
  });
  if(req.body.description) userStorySchema.description = req.body.description;
  if(req.body.registerDate) userStorySchema.description = req.body.registerDate;

  const result = await userStorySchema.save();
  return !result
    ? res.status(400).send({ message: "Error registering user story" })
    : res.status(200).send({ result });
};

const listUserStory = async (req, res) => {
  const userStoryList = await userStory.find({ userId: req.user._id });
  return userStoryList.length === 0
    ? res.status(400).send({ message: "You have no assigned user story" })
    : res.status(200).send({ userStoryList });
};

const listUserStoryAdmin = async (req, res) => {
  const isAdmin = await role.findOne({ _id: req.user.roleId });
  // console.log(`RoleId: ${isAdmin},\n UserRole ${req.user.roleId}`);
  if (isAdmin.name === "admin") {
    if (!req.body.userId)
      return res.status(400).send({ message: "Incomplete data" });

    const userExists = await user.findById({ _id: req.body.userId });
    if (!userExists)
      return res.status(400).send({ message: "User not exists" });

    const userStoryList = await userStory.find({ userId: req.body.userId });
    return userStoryList.length === 0
      ? res.status(400).send({ message: "You have no assigned user story" })
      : res.status(200).send({ userStoryList });
  } else {
    return res.status(400).send({ message: "User is not authorized" });
  }
};

// Updates whatever admin wants
const updateUserStoryAdmin = async (req, res) => {
  if (
    !req.body.bugs ||
    !req.body.userStoryStatus ||
    !req.body.name ||
    !req.body.userId ||
    !req.body.registerDate ||
    !req.body.details
  )
    return res.status(400).send({ message: "Incomplete data" });

  const userStoryExists = await userStory.findById({ _id: req.body._id });
  if (!userStoryExists)
    return res.status(400).send({ message: "User story not exists" });

  const userStoryUpdate = await userStory.findByIdAndUpdate(req.body._id, {
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
    registerDate: req.body.registerDate,
    details: req.body.details,
    userStoryStatus: req.body.userStoryStatus,
    bugs: req.body.bugs,
  });

  return !userStoryUpdate
    ? res.status(400).send({ message: "Error editing user story" })
    : res.status(200).send({ message: "User story updated" });
};

// Update only bugs and status
const updateUserStory = async (req, res) => {
  if (!req.body.bugs || !req.body.userStoryStatus)
    return res.status(400).send({ message: "Incomplete data" });

  const userStoryExists = await userStory.findById({ _id: req.body._id });
  const {
    userId,
    name,
    description,
    registerDate,
    details,
    userStoryStatus,
    bugs,
  } = userStoryExists;

  if (req.body.userStoryStatus === userStoryStatus && req.body.bugs === bugs)
    return res.status(400).send({ message: "You have no changes" });

  const userStoryUpdate = await userStory.findByIdAndUpdate(req.body._id, {
    userId: userId,
    name: name,
    description: description,
    registerDate: registerDate,
    details: details,
    userStoryStatus: req.body.userStoryStatus,
    bugs: req.body.bugs,
  });

  return !userStoryUpdate
    ? res.status(400).send({ message: "Error editing user story" })
    : res.status(200).send({ message: "User story updated" });
};

const deleteUserStory = async (req, res) => {
  const userStoryDelete = await userStory.findByIdAndDelete({
    _id: req.params["_id"],
  });
  if (!userStoryDelete)
    return res.status(400).send({ message: "User story not found" });

  try {
    return res.status(200).send({ message: "User story deleted" });
  } catch (e) {
    console.log("Error deleting user story");
  }
};

export default {
  saveUserStory,
  listUserStory,
  updateUserStory,
  deleteUserStory,
  listUserStoryAdmin,
  updateUserStoryAdmin,
};
