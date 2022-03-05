import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import handleError from "../handleErrors";
import { AXIOS } from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { UseMainContext } from "../context";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="#">
                Zains challenge
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default function SignIn() {
    const [inputs, setInputs] = useState({ email: "admin@gmail.com", password: "123456" });
    const navigate = useNavigate();
    const {setUser} = UseMainContext()
    const [isSaving, setIsSaving] = useState(false)

    const handleInputsChange = (e) => {
        const { value, name } = e.target;
        setInputs((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const response = await AXIOS.post("/login", inputs);
            const { admin, token, userId, name } = response.data.payload;
            console.log(response.data.payload);
            localStorage.setItem("token", token);
            setUser({ name, admin, userId });
            if (!admin) {
                navigate("/user");
            }else{
                navigate("/home");
            }
            toast.success('Successfully loged in')
        } catch (error) {
            handleError(error);
        }
        setIsSaving(false)
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={inputs.email}
                        autoComplete="off"
                        type="email"
                        onChange={handleInputsChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value={inputs.password}
                        onChange={handleInputsChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSaving}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
