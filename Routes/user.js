const {
    addUser,
    deleteUser,
    decodeVerifyToken,
    getAllUsers,
    logout,
} = require("../Controller/user");
const { verifyAdmin } = require("../Middlewares/verifyAdmin");

const router = require("express").Router();

router.post("/", verifyAdmin, addUser);
router.delete("/:userId", verifyAdmin, deleteUser);
router.get("/", verifyAdmin, getAllUsers);
router.get("/decodeVerifyToken", decodeVerifyToken);
router.post("/logout", logout);

module.exports = router;
