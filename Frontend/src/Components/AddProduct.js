import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input, TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { AXIOS } from "../axios";
import handleError from "../handleErrors";
import { toast } from "react-toastify";
import { UseMainContext } from "../context";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    backgroundColor: "#fff",
    border: "none",
    padding: "1% 4%",
    minWidth: "400px",
};

const useStyles = makeStyles({
    form: {},
});

export default function AddProduct({
    open,
    handleClose,
    getProducts,
    productModalType,
    modalData,
    viewId
}) {
    const classes = useStyles();
    const { user } = UseMainContext();
    const [isSaving, setIsSaving] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState("");
    const [inputs, setInputs] = React.useState({
        name: "",
        description: "",
        price: "",
    });

    React.useEffect(() => {
        if (productModalType === "update" && modalData) {
            const { name, price, description, imageUrl } = modalData;
            setInputs({ name: name, description: description, price: price });
            setImagePreview(imageUrl);
            setSelectedFile(imageUrl);
        }
    }, []);

    const handleInputsChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const handleImageChange = (e) => {
        setSelectedFile(e.target.files[0]);
        var src = URL.createObjectURL(e.target.files[0]);
        setImagePreview(src);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in inputs) {
            formData.append(key, inputs[key]);
        }
        if (productModalType === "add") {
            formData.append("image", selectedFile);
        } else if (selectedFile?.name) {
            formData.append("image", selectedFile);
        }
        setIsSaving(true);
        try {
            if (productModalType === "add") {
                await AXIOS.post("/products/" + user?.userId, formData);
                toast.success("Successfully added");
            } else {
                await AXIOS.patch(
                    `/products/${viewId || user?.userId}/${modalData._id}`,
                    formData
                );
                toast.success("Successfully Updated!");
            }
            getProducts();
            handleClose();
        } catch (error) {
            handleError(error);
        }
        setIsSaving(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        ADD NEW PRODUCT
                    </Typography>
                    <form
                        className={classes.form}
                        style={{ display: "flex", flexDirection: "column" }}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.name}
                            label="Name"
                            name="name"
                            margin="normal"
                            type="text"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.description}
                            label="Description"
                            margin="normal"
                            type="text"
                            name="description"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.price}
                            margin="normal"
                            label="Price"
                            type="Number"
                            name="price"
                            min="0"
                            required
                        />
                        {imagePreview ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "14px 0",
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    width="320"
                                    alt="Preview"
                                />
                                <Button
                                    variant="contained"
                                    style={{ marginLeft: "1%" }}
                                    color="secondary"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setImagePreview("");
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                style={{ margin: "14px 0" }}
                            >
                                Upload File
                                <input
                                    required
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isSaving}
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
