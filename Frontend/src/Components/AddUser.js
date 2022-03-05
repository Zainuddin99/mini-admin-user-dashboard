import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { AXIOS } from "../axios";
import { toast } from "react-toastify";
import handleError from "../handleErrors";

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
    form: {
    },
});

export default function AddUser({ open, handleClose, getAllUsers }) {
    const classes = useStyles();
    const [inputs, setInputs] = useState({
        name: "",
        password: "",
        phone: "",
        address: "",
        email: "",
    });
    const [isSaving, setIsSaving] = useState(false)

    const handleInputsChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async e =>{
        e.preventDefault();
        setIsSaving(true);
        try {
            await AXIOS.post('/user', inputs)
            toast.success("Successfully added")
            getAllUsers();
            handleClose()
        } catch (error) {
            handleError(error);
        }
        setIsSaving(false);
    }

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
                        ADD NEW USER
                    </Typography>
                    <form
                        className={classes.form}
                        style={{ display: "flex", flexDirection: "column" }}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.name}
                            name="name"
                            label="Name"
                            type="text"
                            margin="normal"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.email}
                            name="email"
                            label="Email"
                            margin="normal"
                            type="email"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.password}
                            name="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.phone}
                            name="phone"
                            label="Phone number"
                            type="phone"
                            margin="normal"
                            required
                        />
                        <TextField
                            onChange={handleInputsChange}
                            value={inputs.address}
                            name="address"
                            label="Address"
                            type="address"
                            margin="normal"
                            required
                        />
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
