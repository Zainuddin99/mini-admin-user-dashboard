const {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
} = require("../Controller/products");

const router = require("express").Router();

const multer = require("multer");
const fs = require("fs");

//Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { userId } = req.params;
        let path = `./documents/Products/${userId}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split("/")[1];
        cb(null, Date.now() + "." + extension);
    },
});

//multer setup with configuration
const upload = multer({ storage });

router.post("/:userId", upload.single("image"), addProduct);
router.get("/:userId", getProducts);
router.delete("/:userId/:productId", deleteProduct);
router.patch("/:userId/:productId", upload.single("image"), updateProduct);

module.exports = router;
