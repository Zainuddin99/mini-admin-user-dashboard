const router = require("express").Router();
const { getAactivities } = require("../Controller/activities");
const { verifyAdmin } = require("../Middlewares/verifyAdmin");

router.get("/", verifyAdmin, getAactivities);

module.exports = router;
