const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const groupController = require("../controllers/groupController");

const router = express.Router();

// CREATE GROUP
router.post("/", auth, [body("name").notEmpty()], validate, groupController.createGroup);

// GET MY GROUPS (NEW)
router.get("/my", auth, groupController.getMyGroups);

// GET ALL GROUPS (NEW)
router.get("/", auth, groupController.getAllGroups);

// GET GROUP BY ID
router.get("/:groupId", auth, groupController.getGroup);

// UPDATE GROUP (NEW)
router.put(
  "/:groupId",
  auth,
  [body("name").optional().notEmpty()],
  validate,
  groupController.updateGroup,
);

// DELETE GROUP (NEW)
router.delete("/:groupId", auth, groupController.deleteGroup);

// GROUP SUMMARY
router.get("/:groupId/summary", auth, groupController.groupSummary);

module.exports = router;
